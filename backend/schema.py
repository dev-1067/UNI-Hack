from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any

HEADERS_252 = ['MFR URL', 'Ref URL 1', 'Ref URL 2', 'Ref URL 3', 'Ref URL 4', 'Ref URL 5', 'PART_NUMBER', 'Dept', 'Class', 'Fine', 'SKU - MY_PART_NUMBER', 'Mfg_Part_Num', 'Part_Desc', 'E1_Brand', 'Unilog_Brand', 'DIB_Brand', 'Part_Manuf', 'MANUFACTURER_NAME', 'BRAND_NAME', 'TRADE_NAME', 'MANUFACTURER_PART_NUMBER', 'ALTERNATE_PART_NUMBER', 'Classpath', 'MOBILE_DESC', 'INVOICE_DESC', 'SHORT_DESC', 'LONG_DESC1', 'RETAIL_DESC', 'MARKETING_DESCRIPTION', 'ITEM_FEATURES_1', 'ITEM_FEATURES_2', 'ITEM_FEATURES_3', 'ITEM_FEATURES_4', 'ITEM_FEATURES_5', 'ITEM_FEATURES_6', 'ITEM_FEATURES_7', 'ITEM_FEATURES_8', 'ITEM_FEATURES_9', 'ITEM_FEATURES_10', 'ITEM_FEATURES_11', 'ITEM_FEATURES_12', 'ITEM_FEATURES_13', 'ITEM_FEATURES_14', 'ITEM_FEATURES_15', 'ITEM_FEATURES_16', 'ITEM_FEATURES_17', 'ITEM_FEATURES_18', 'ITEM_FEATURES_19', 'ITEM_FEATURES_20', 'With', 'Standard/Approvals', 'Prop 65', 'Application', 'Includes', 'Product Name']
for i in range(1, 51):
    HEADERS_252.extend([f'ATTRIBUTE_LABEL {i}', f'ATTRIBUTE_VALUE {i}', f'ATTRIBUTE_UOM {i}'])
HEADERS_252.extend(['UPC', 'EAN', 'GTIN', 'UNSPSC', 'Warranty', 'List Price', 'Selling Qty', 'Selling UOM', 'Standard Packaging Information', 'LENGTH', 'LENGTH_UOM', 'HEIGHT', 'HEIGHT_UOM', 'WIDTH', 'WIDTH_UOM', 'WEIGHT', 'WEIGHT_UOM', 'VOLUME', 'VOLUME_UOM', 'Product Image', 'Alternate Image 1', 'Alternate Image 2', 'Alternate Image 3', 'Alternate Image 4', 'SDS', 'SDS_1', 'Warranty Information', 'Catalog', 'Specification Sheet', 'Instruction/Installation Manual', 'Service Manual', 'Owners/User Manual', 'Line Drawing', 'MTR', 'RoHS', 'Full Engineering Drawing', 'Energy Star Guide', 'Technical Bulletin', 'Submittal', 'Compatibility Chart', 'Size Chart', 'Product Label/Insert', 'Video Link', 'Video Link 1', 'Country Of Origin', 'Discontinued', 'Actual Image (Yes/No)'])


class UnihackCatalogRecord(BaseModel):
    """
    Core schema representing the populated fields of the Unihack format.
    The remaining columns will be padded automatically.
    """
    model_config = ConfigDict(populate_by_name=True)

    # Core Identifiers
    mfr_url: str = Field(alias="MFR URL", default="")
    ref_url1: str = Field(alias="Ref URL 1", default="")
    part_number: str = Field(alias="PART_NUMBER", default="")
    mfg_part_num: str = Field(alias="Mfg_Part_Num", default="")
    part_desc: str = Field(alias="Part_Desc", default="")
    
    # Classification
    dept: str = Field(alias="Dept", default="")
    class_name: str = Field(alias="Class", default="")
    fine: str = Field(alias="Fine", default="")
    classpath: str = Field(alias="Classpath", default="")
    
    # Brands
    brand: str = Field(alias="BRAND_NAME", default="")
    manufacturer: str = Field(alias="MANUFACTURER_NAME", default="")
    
    # Descriptions (Step 7)
    mobile_desc: str = Field(alias="MOBILE_DESC", default="")
    invoice_desc: str = Field(alias="INVOICE_DESC", default="")
    short_desc: str = Field(alias="SHORT_DESC", default="")
    long_desc1: str = Field(alias="LONG_DESC1", default="")
    retail_desc: str = Field(alias="RETAIL_DESC", default="")
    
    # Attributes
    attributes: Dict[str, str] = Field(description="Dynamic attributes.", default_factory=dict)
    
def export_to_252_columns(record: UnihackCatalogRecord) -> Dict[str, Any]:
    """
    Takes the core populated record and expands it into a dictionary 
    with exactly 252 keys matching the Unihack CSV Delivery Format schema.
    """
    output = {h: "" for h in HEADERS_252}
    dumped = record.model_dump(by_alias=True, exclude={"attributes"})
    
    for k, v in dumped.items():
        if k in output:
            output[k] = v
            
    # Map dynamic attributes
    attr_idx = 1
    for label, val in record.attributes.items():
        if attr_idx <= 50:
            if f"ATTRIBUTE_LABEL {attr_idx}" in output:
                output[f"ATTRIBUTE_LABEL {attr_idx}"] = label
                # basic UOM split if space exists at end
                parts = val.rsplit(" ", 1)
                if len(parts) == 2 and parts[1] in ["in", "mm", "V", "A", "dBA", "W", "lbs", "kg", "Hz"]:
                    output[f"ATTRIBUTE_VALUE {attr_idx}"] = parts[0]
                    output[f"ATTRIBUTE_UOM {attr_idx}"] = parts[1]
                else:
                    output[f"ATTRIBUTE_VALUE {attr_idx}"] = val
            attr_idx += 1
            
    return output
