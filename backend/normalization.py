import re
from typing import List, Tuple
from backend.schema import UnihackCatalogRecord

PLACEHOLDERS = ["-- Unbranded --", "-- No Unilog Brand --", "-- No DIB Brand --", "UNKNOWN", ""]

def is_placeholder(val: str) -> bool:
    return val.strip() in PLACEHOLDERS

def normalize_brand(raw_brand: str) -> str:
    """
    Filters out placeholders. If not a placeholder, returns the brand.
    (In a full implementation, this would fuzzy match against the 27k list).
    """
    if is_placeholder(raw_brand):
        return ""
    return raw_brand.strip()

def classify_product(part_number: str, text_content: str) -> tuple:
    """
    Step 3: Category Classification (3-level taxonomy)
    Returns (Dept, Class, Fine)
    """
    text_lower = text_content.lower()
    
    if "dishwasher" in text_lower:
        return ("Appliances", "Large Appliances", "Dishwashers")
    elif "sanding" in text_lower or "belt" in text_lower or "abrasive" in text_lower:
        return ("Power Tool Accessories", "Abrasives", "Sanding Belts")
    elif "drill" in text_lower or "bit" in text_lower:
        return ("Power Tool Accessories", "Drilling", "Drill Bits")
    elif "bolt" in text_lower or "screw" in text_lower:
        return ("Fasteners", "Screws & Bolts", "Machine Screws")
        
    return ("Unclassified", "Unclassified", "Unclassified")

def normalize_units(attributes: list) -> dict:
    """
    Step 6: Unit & Fraction Normalization
    Converts decimals to fractions (e.g. 0.5 -> 1/2)
    Ensures space between number and unit (e.g. 24 in)
    """
    clean_attrs = {}
    for attr in attributes:
        val = attr.value
        # Decimals to fractions
        val = val.replace("0.5", "1/2").replace("0.25", "1/4").replace("0.75", "3/4")
        
        # Unit abbreviations
        val = val.replace("inches", "in").replace("inch", "in").replace("IN.", "in").replace("\"", "in")
        
        # Ensure space before 'in' if it immediately follows a number
        val = re.sub(r'(\d)(in)(?!\w)', r'\1 \2', val)
        
        if attr.uom and attr.uom not in val:
            final_val = f"{val.strip()} {attr.uom.strip()}"
        else:
            final_val = val.strip()
            
        clean_attrs[attr.attribute_label] = final_val
        
    return clean_attrs

def generate_descriptions(record: UnihackCatalogRecord) -> UnihackCatalogRecord:
    """
    Step 7: Fixed Description Templates matching Content Guidelines.
    """
    attrs = record.attributes
    series = attrs.get("Series", "")
    item_type = attrs.get("Item Type", record.fine)
    
    # Collect key specs excluding Series
    specs_list = [f"{k}: {v}" for k, v in attrs.items() if k != "Series"]
    specs_str = ", ".join(specs_list[:5])
    
    brand_disp = record.brand if record.brand else record.manufacturer
    mpn_disp = record.mfg_part_num if record.mfg_part_num else record.part_number
    
    # 1. Invoice Desc (<=40 char, CAPS)
    # Format: ITEM_TYPE KEY_ATTRS
    inv_base = f"{item_type} {specs_str}".upper()
    inv_base = re.sub(r'[^\w\s\-\/]', '', inv_base) # Remove most punctuation
    record.invoice_desc = inv_base[:40].strip()
    
    # 2. Mobile Desc (60-80 char)
    # Format: Manufacturer Brand, ItemType, Series, MPN
    mob_parts = [p for p in [record.manufacturer, record.brand, item_type, series, mpn_disp] if p]
    mob_base = " ".join(mob_parts)
    record.mobile_desc = mob_base[:80].strip()
    
    # 3. Product Title / Short Desc
    # Format: Brand + Series + MPN + Item Type + key attributes
    short_parts = [p for p in [brand_disp, series, mpn_disp, item_type, specs_str] if p]
    record.short_desc = " ".join(short_parts)
    
    # 4. Long Description
    record.long_desc1 = record.short_desc # simplified for now
    
    # 5. Retail Desc
    record.retail_desc = record.short_desc
    
    return record
