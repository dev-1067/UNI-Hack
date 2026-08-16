import os
from typing import List
from dotenv import load_dotenv

# Import local modules
from ai_agent.ingestion import parse_pdf
from ai_agent.web_search import exact_web_search
from ai_agent.extraction import extract_product_specs, ProductRecord

# Load environment variables
load_dotenv()

# Sample List of Values (LOV) for testing
SAMPLE_LOV = [
    "Thread Size", "Material", "Length", "Drive Type", 
    "Head Style", "System of Measurement", "Finish"
]

def run_agent_pipeline(brand: str, part_number: str, pdf_path: str = None) -> ProductRecord:
    """
    Orchestrates the entire Person 1 AI pipeline:
    1. Parse PDF (if provided)
    2. Exact Web Search (with cache fallback)
    3. Strict LOV Extraction
    """
    print(f"\n🚀 Starting AI Pipeline for: {brand} - {part_number}")
    print("-" * 50)
    
    raw_text = ""
    
    # Step 1: Ingestion
    if pdf_path:
        raw_text += parse_pdf(pdf_path) + "\n\n"
        
    # Step 4: Web Search Grounding
    search_results = exact_web_search(part_number, brand)
    
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
    final_record.part_number = part_number
    final_record.brand = brand
    
    print("\n✅ Pipeline Complete!")
    print("-" * 50)
    return final_record
