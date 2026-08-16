from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

# Person 1's pipeline
from ai_agent.pipeline import run_agent_pipeline

# Person 2's components
from backend.schema import UnihackCatalogRecord, export_to_252_columns
from backend.normalization import (
    normalize_brand, 
    classify_product, 
    normalize_units,
    generate_descriptions
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Product Intelligence Agent API",
    description="Backend for the UniHack 2026 Industrial Commerce pipeline.",
    version="1.0.0"
)

# Enable CORS for the React Frontend (typically runs on port 5173 or 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon demo purposes, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    part_number: str
    brand: str
    pdf_path: Optional[str] = None

@app.post("/api/process", summary="Process a product into a 252-column CSV record")
async def process_product(request: ProcessRequest) -> Dict[str, Any]:
    """
    Main endpoint that orchestrates the entire 7-step pipeline.
    """
    # 1. Run the AI Pipeline (Ingestion, Web Search, Extraction)
    try:
        raw_ai_record = run_agent_pipeline(
            brand=request.brand, 
            part_number=request.part_number, 
            pdf_path=request.pdf_path
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Pipeline failed: {str(e)}")
        
    if not raw_ai_record:
        raise HTTPException(status_code=404, detail="No data could be extracted.")

    # 2. Map and Normalize the data into the structured schema
    
    # Step 2: Brand Fuzzy Matching
    clean_brand = normalize_brand(raw_ai_record.brand)
    
    # Step 3: Category Classification (Mocked based on raw text - for a real app, pass the full text)
    dept, class_name, fine = classify_product(
        part_number=raw_ai_record.part_number, 
        text_content=str(raw_ai_record.attributes)
    )
    
    # Step 6: Unit Normalization
    clean_attributes = normalize_units(raw_ai_record.attributes)
    
    # Create the base Unihack record
    record = UnihackCatalogRecord(
        E1_Brand=clean_brand,
        Part_Number=raw_ai_record.part_number,
        Department=dept,
        Class=class_name,
        Fine=fine,
        MFR_URL=raw_ai_record.ref_url,
        Ref_URL_1=raw_ai_record.ref_url,
        attributes=clean_attributes
    )
    
    # Step 7: Fixed Description Templates
    record = generate_descriptions(record)
    
    # 3. Export to the 252-column format
    final_output = export_to_252_columns(record)
    
    return final_output

@app.get("/health")
def health_check():
    return {"status": "ok"}
