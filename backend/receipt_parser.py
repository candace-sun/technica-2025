# receipt_parser_advanced.py

import pytesseract
from PIL import Image
import re
import requests
from dotenv import load_dotenv
import os

load_dotenv()  # load USDA_API_KEY from .env

# Optional: path to tesseract if not in PATH
# pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'

usda_api_key = os.getenv("USDA_API_KEY")


def is_food(item_name):
    """Check if item_name exists in USDA FoodData Central"""
    if not usda_api_key:
        print("Warning: USDA_API_KEY not set. Skipping food validation.")
        return True  # fallback: consider all items food
    query = item_name
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search?query={query}&api_key={usda_api_key}"
    try:
        response = requests.get(url).json()
        return len(response.get("foods", [])) > 0
    except Exception as e:
        print(f"Error querying USDA API: {e}")
        return True  # fallback


def parse_receipt(image_path):
    """
    Parse a receipt image and return:
    {
        "store": "Store Name",
        "date": "YYYY-MM-DD",
        "items": [
            {"name": "apple", "quantity": "2"},
            {"name": "milk", "quantity": "16 oz"},
            ...
        ]
    }
    """
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    lines = text.split("\n")

    result = {"store": None, "date": None, "items": []}

    for line in lines:
        if line.strip():
            result["store"] = line.strip()
            break

    date_patterns = [
        r"(\d{1,2}/\d{1,2}/\d{4})",       # MM/DD/YYYY
        r"(\d{4}-\d{1,2}-\d{1,2})"        # YYYY-MM-DD
    ]
    for line in lines:
        for pattern in date_patterns:
            match = re.search(pattern, line)
            if match:
                result["date"] = match.group(1)
                break
        if result["date"]:
            break

    # --- Detect items with quantities ---
    quantity_pattern = r"(\d+\s*(?:oz|lb|g|kg|ml|l)?)|x(\d+)"
    price_pattern = r"\$?\d+\.\d{2}"

    raw_items = []
    for line in lines:
        line = line.strip()
        if not line or re.search(r"total|cash|change|tax|loyalty", line, re.I):
            continue

        # Remove price from line
        line_no_price = re.sub(price_pattern, "", line)

        # Find quantity
        qty_match = re.search(quantity_pattern, line_no_price, re.I)
        if qty_match:
            quantity = qty_match.group(0)
            name = line_no_price.replace(quantity, "").strip()
        else:
            quantity = "1"
            name = line_no_price.strip()

        if name:
            raw_items.append({"name": name.lower(), "quantity": quantity})

    # --- Filter items to keep only foods ---
    filtered_items = []
    for item in raw_items:
        if is_food(item["name"]):
            filtered_items.append(item)

    result["items"] = filtered_items
    return result


# --- Example usage ---
if __name__ == "__main__":
    parsed = parse_receipt("images/veggie-grocery-receipt_orig.jpeg")
    print(parsed)
