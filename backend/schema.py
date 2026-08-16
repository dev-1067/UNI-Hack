from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any

class UnihackCatalogRecord(BaseModel):
    """
    Core schema representing the populated fields of the Unihack format.
    The remaining 200+ columns will be padded automatically.
    """
    model_config = ConfigDict(populate_by_name=True)

    # Core Identifiers
    brand: str = Field(alias="E1_Brand", default="")
    part_number: str = Field(alias="Part_Number", default="")
    
    # Classification
    dept: str = Field(alias="Department", default="")
    class_name: str = Field(alias="Class", default="")
    fine: str = Field(alias="Fine", default="")
    
    # Descriptions (Step 7)
    mobile_desc: str = Field(alias="MOBILE_DESC", default="")
    invoice_desc: str = Field(alias="INVOICE_DESC", default="")
    short_desc: str = Field(alias="SHORT_DESC", default="")
    long_desc1: str = Field(alias="LONG_DESC1", default="")
    retail_desc: str = Field(alias="RETAIL_DESC", default="")
    
    # Traceability
    mfr_url: str = Field(alias="MFR_URL", default="")
    ref_url1: str = Field(alias="Ref_URL_1", default="")
    
    # Attributes
    attributes: Dict[str, str] = Field(description="Dynamic attributes (up to 50 allowed).", default_factory=dict)
    
def export_to_252_columns(record: UnihackCatalogRecord) -> Dict[str, Any]:
    """
    Takes the core populated record and expands it into a dictionary 
    with exactly 252 keys matching the Unihack CSV Delivery Format schema.
    """
    # Start with all 252 columns blank (using generic names for this example)
    output = {f"Column_{i+1}": "" for i in range(252)}
    
    # Map the core fields to their specific Unihack column names
    # Note: In a real scenario, you map Column_1 to 'E1_Brand', etc.
    # For this demo, we inject them manually based on aliases.
    
    dumped = record.model_dump(by_alias=True, exclude={"attributes"})
    
    # Map fixed columns (Example mappings, adjust according to actual CSV template)
    output["Column_1"] = dumped.get("E1_Brand", "")
    output["Column_2"] = dumped.get("Part_Number", "")
    output["Column_3"] = dumped.get("Department", "")
    output["Column_4"] = dumped.get("Class", "")
    output["Column_5"] = dumped.get("Fine", "")
    output["Column_6"] = dumped.get("MOBILE_DESC", "")
    output["Column_7"] = dumped.get("INVOICE_DESC", "")
    output["Column_8"] = dumped.get("SHORT_DESC", "")
    output["Column_9"] = dumped.get("LONG_DESC1", "")
    output["Column_10"] = dumped.get("RETAIL_DESC", "")
    output["Column_11"] = dumped.get("MFR_URL", "")
    output["Column_12"] = dumped.get("Ref_URL_1", "")
    
    # Map dynamic attributes (e.g., Column 50 to 150)
    col_idx = 50
    for label, val in record.attributes.items():
        if col_idx <= 150: # Limit to 50 pairs
            output[f"Column_{col_idx}"] = label
            output[f"Column_{col_idx+1}"] = val
            col_idx += 2
            
    return output
