import os
from typing import List
from dotenv import load_dotenv

# Import local modules
from ai_agent.ingestion import parse_pdf
from ai_agent.web_search import exact_web_search
from ai_agent.extraction import extract_product_specs, ProductRecord

# Load environment variables
load_dotenv()

# Sample List of Values (LOV) for testing since we lack the 161k row file
SAMPLE_LOV = [
    "Series", "Item Type", "Thread Size", "Material", "Length", "Drive Type", 
    "Head Style", "System of Measurement", "Finish", "Mounting Type",
    "Number of Wash Cycles", "Voltage Rating", "Amperage Rating", "Sound Level"
]

def run_agent_pipeline(mfg_part_num: str, part_desc: str, part_manuf: str, pdf_path: str = None) -> ProductRecord:
    """
    Orchestrates the entire Person 1 AI pipeline:
    1. Parse PDF (if provided)
    2. Exact Web Search (with cache fallback)
    3. Strict LOV Extraction
    """
    print(f"\n🚀 Starting AI Pipeline for: {part_manuf} - {mfg_part_num}")
    print("-" * 50)
    
    raw_text = part_desc + "\n"
    
    # Step 1: Ingestion
    if pdf_path:
        raw_text += parse_pdf(pdf_path) + "\n\n"
        
    # Step 4: Web Search Grounding
    search_results = exact_web_search(mfg_part_num, part_manuf)
    
    # Combine PDF text and Web text
    if search_results["content"]:
        raw_text += search_results["content"]
        
    if not raw_text.strip():
        print("❌ No text could be extracted from PDF or Web Search.")
        return None
        
    # Step 5: Strict LOV Extraction
    final_record = extract_product_specs(
        text_content=raw_text, 
        source_url=search_results["url"], 
        lov_categories=SAMPLE_LOV
    )
    
    # Manually inject the requested metadata if the LLM missed it
    final_record.part_number = mfg_part_num
    final_record.brand = part_manuf
    
    print("\n✅ Pipeline Complete!")
    print("-" * 50)
    return final_record
