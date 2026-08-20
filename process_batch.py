import csv
import json
import time
import requests
import sys

# Fix encoding for Windows print statements
sys.stdout.reconfigure(encoding='utf-8')

INPUT_CSV = r"c:\Users\ankus\UNI-Hack\data\Unihack_ Sample Dataset - Input.csv"
OUTPUT_CSV = r"c:\Users\ankus\UNI-Hack\data\output_submission.csv"
API_URL = "http://localhost:8000/api/process"

def process_batch(limit=5):
    with open(INPUT_CSV, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
    print(f"Loaded {len(rows)} rows from input. Processing first {limit}...")
    
    results = []
    
    for i, row in enumerate(rows[:limit]):
        print(f"\nProcessing {i+1}/{limit}: {row['Mfg_Part_Num']}")
        
        payload = {
            "mfg_part_num": row["Mfg_Part_Num"],
            "part_desc": row["Part_Desc"],
            "e1_brand": row["E1_Brand"],
            "unilog_brand": row["Unilog_Brand"],
            "dib_brand": row["DIB_Brand"],
            "part_manuf": row["Part_Manuf"]
        }
        
        try:
            resp = requests.post(API_URL, json=payload, timeout=60)
            if resp.status_code == 200:
                results.append(resp.json())
                print(f"SUCCESS")
            else:
                print(f"FAILED: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"ERROR: {e}")
            
        time.sleep(1) # Rate limiting
        
    if not results:
        print("\nNo successful results to save.")
        return
        
    # Save to CSV
    headers = list(results[0].keys())
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(results)
        
    print(f"\nSaved {len(results)} rows to {OUTPUT_CSV}")

if __name__ == "__main__":
    process_batch(limit=3)
