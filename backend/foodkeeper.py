from datetime import datetime, timedelta
import json

# Load JSON once
with open("foodkeeper.json") as f:
    FOODKEEPER_DATA = json.load(f)

print("DEBUG: Total products loaded:", len(FOODKEEPER_DATA["sheets"][2]["data"]))

# Normalize text
def normalize_name(name_raw: str) -> str:
    name = name_raw.lower()
    name = "".join(c for c in name if c.isalnum() or c.isspace())
    for word in ["fresh", "organic", "bag", "pack", "slice", "sliced"]:
        name = name.replace(word, "")
    return name.strip()

# Map name to product row
def map_to_product(name_raw: str):
    normalized = normalize_name(name_raw)
    print(f"DEBUG: Looking for '{name_raw}' -> normalized: '{normalized}'")

    for row in FOODKEEPER_DATA["sheets"][2]["data"]:
        row_dict = {k: v for d in row for k, v in d.items()}

        # Exact name match
        name_field = (row_dict.get("Name") or "").lower()
        if normalized == name_field:
            print(f"DEBUG: Found exact match: {row_dict.get('Name')}")
            return row_dict

        # Keyword match
        keywords = (row_dict.get("Keywords") or "").lower()
        if keywords:
            keyword_list = [k.strip() for k in keywords.split(',')]
            if normalized in keyword_list:
                print(f"DEBUG: Found keyword match: {row_dict.get('Keywords')}")
                return row_dict

        # Partial match
        if normalized in name_field or normalized in keywords:
            print(f"DEBUG: Found partial match: {row_dict.get('Name')}")
            return row_dict

    print("DEBUG: No match found")
    return None

# Get refrigeration info using keys
def get_refrigeration_info(product_row):
    if not product_row:
        return None

    # Priority: Refrigerate, DOP_Refrigerate, After_Opening
    for key, source in [("Refrigerate_Max", "refrigerate"),
                        ("DOP_Refrigerate_Max", "dop_refrigerate"),
                        ("Refrigerate_After_Opening_Max", "after_opening")]:
        if product_row.get(key) is not None:
            metric_key = key.replace("Max", "Metric")
            return {"days": product_row[key], "metric": product_row.get(metric_key), "source": source}

    return None

# Convert any metric to days
def convert_to_days(value, metric):
    if not value or not metric:
        return None
    metric = metric.lower()
    if "day" in metric:
        return value
    elif "week" in metric:
        return value * 7
    elif "month" in metric:
        return value * 30
    elif "year" in metric:
        return value * 365
    else:
        return value  # default to days if unknown

# Compute expiration date
def get_expiration_date(product_row):
    if not product_row:
        return None
    refrig_info = get_refrigeration_info(product_row)
    if not refrig_info:
        print("DEBUG: No refrigeration info available")
        return None
    days = convert_to_days(refrig_info["days"], refrig_info["metric"])
    if days is None:
        print("DEBUG: Could not convert days")
        return None
    expiration_date = datetime.now() + timedelta(days=days)
    return expiration_date.strftime("%Y-%m-%d")

# Full pipeline
def get_food_expiration(food_name: str):
    product_row = map_to_product(food_name)
    expiration_date = get_expiration_date(product_row)
    refrig_info = get_refrigeration_info(product_row) if product_row else None

    return {
        "raw_name": food_name,
        "expiration_date": expiration_date,
        "product_found": product_row is not None,
        "data_source": refrig_info['source'] if refrig_info else None
    }

# For testing
if __name__ == "__main__":
    print(get_food_expiration("milk"))
    print(get_food_expiration("dragon fruit"))
