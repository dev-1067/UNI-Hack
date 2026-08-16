from thefuzz import process
from backend.schema import UnihackCatalogRecord

# Mock list of 76+ approved manufacturers
APPROVED_BRANDS = [
    "Diablo", "Freud Inc", "DeWalt", "Makita", "Milwaukee", 
    "Bosch", "3M", "Stanley", "Fastenal", "Grainger"
]

def normalize_brand(raw_brand: str) -> str:
    """
    Step 2: Brand Fuzzy Matching
    Matches a raw brand string against the approved list using fuzzy logic.
    """
    if not raw_brand:
        return "UNKNOWN"
        
    # Extract the best match using thefuzz
    best_match, score = process.extractOne(raw_brand, APPROVED_BRANDS)
    
    # If the score is above a threshold, accept it. Otherwise flag it.
    if score > 80:
        return best_match
    return f"REVIEW_NEEDED: {raw_brand}"

def classify_product(part_number: str, text_content: str) -> tuple:
    """
    Step 3: Category Classification (3-level taxonomy)
    Returns (Dept, Class, Fine)
    For this demo, we use basic keyword matching.
    """
    text_lower = text_content.lower()
    
    if "sanding" in text_lower or "belt" in text_lower or "abrasive" in text_lower:
        return ("Power Tool Accessories", "Abrasives", "Sanding Belts")
    elif "drill" in text_lower or "bit" in text_lower:
        return ("Power Tool Accessories", "Drilling", "Drill Bits")
    elif "bolt" in text_lower or "screw" in text_lower:
        return ("Fasteners", "Screws & Bolts", "Machine Screws")
        
    return ("Unclassified", "Unclassified", "Unclassified")

def normalize_units(attributes: list) -> dict:
    """
    Step 6: Unit & Fraction Normalization
    Takes the raw attributes from the LLM and cleans them up.
    Returns a dictionary of clean attributes.
    """
    clean_attrs = {}
    for attr in attributes:
        val = attr.value
        # Example Normalization: Convert fractions and "inch" to "in"
        val = val.replace("inch", "in").replace("inches", "in").replace("\"", " in")
        val = val.replace("1/2", "0.5").replace("1/4", "0.25").replace("3/4", "0.75")
        
        # Combine value and UOM
        if attr.uom and attr.uom not in val:
            final_val = f"{val.strip()} {attr.uom.strip()}"
        else:
            final_val = val.strip()
            
        clean_attrs[attr.attribute_label] = final_val
        
    return clean_attrs

def generate_descriptions(record: UnihackCatalogRecord) -> UnihackCatalogRecord:
    """
    Step 7: Fixed Description Templates
    Pieces together attributes to create deterministic descriptions.
    """
    # Create a string of key attributes
    specs_str = " | ".join([f"{k}: {v}" for k, v in record.attributes.items()][:5])
    
    base_desc = f"{record.brand} {record.part_number}"
    
    record.short_desc = f"{base_desc} - {record.class_name}"
    record.mobile_desc = f"{base_desc} [{record.fine}]"
    record.invoice_desc = f"{base_desc} - {specs_str}"
    record.long_desc1 = f"Premium {record.fine} by {record.brand}. Specifications: {specs_str}."
    record.retail_desc = record.long_desc1
    
    return record
