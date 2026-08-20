from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

from ai_agent.pipeline import run_agent_pipeline
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    mfg_part_num: str
    part_desc: str
    e1_brand: str = ""
    unilog_brand: str = ""
    dib_brand: str = ""
    part_manuf: str = ""
    pdf_path: Optional[str] = None

@app.post("/api/process", summary="Process a product into a 252-column CSV record")
async def process_product(request: ProcessRequest) -> Dict[str, Any]:
    """
    Main endpoint that orchestrates the entire 7-step pipeline.
    """
    try:
        raw_ai_record = run_agent_pipeline(
            mfg_part_num=request.mfg_part_num,
            part_desc=request.part_desc,
            part_manuf=request.part_manuf,
            pdf_path=request.pdf_path
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Pipeline failed: {str(e)}")
        
    if not raw_ai_record:
        raise HTTPException(status_code=404, detail="No data could be extracted.")

    # 1. Base initialization from Request and AI Record
    record = UnihackCatalogRecord(
        MFR_URL=raw_ai_record.ref_url,
        Ref_URL_1=raw_ai_record.ref_url,
        PART_NUMBER=request.mfg_part_num,
        Mfg_Part_Num=request.mfg_part_num,
        Part_Desc=request.part_desc
    )
    
    # 2. Brand Normalization
    # Determine the best brand string to use (fallback logic)
    raw_brand = request.e1_brand if request.e1_brand and request.e1_brand != "-- Unbranded --" else request.part_manuf
    clean_brand = normalize_brand(raw_brand)
    record.brand = clean_brand
    record.manufacturer = normalize_brand(request.part_manuf)
    
    # 3. Category Classification
    dept, class_name, fine = classify_product(
        part_number=request.mfg_part_num, 
        text_content=f"{request.part_desc} {str(raw_ai_record.attributes)}"
    )
    record.dept = dept
    record.class_name = class_name
    record.fine = fine
    
    # 4. Unit Normalization
    clean_attributes = normalize_units(raw_ai_record.attributes)
    record.attributes = clean_attributes
    
    # 5. Fixed Description Templates
    record = generate_descriptions(record)
    
    # 6. Export to 252-column format
    final_output = export_to_252_columns(record)
    
    return final_output

@app.get("/health")
def health_check():
    return {"status": "ok"}

