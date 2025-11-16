from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil, os
from test_image_detection import recognize_items
from foodkeeper import get_food_expiration  # Import your foodkeeper function
import re

app = FastAPI()

# Allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class ExpirationRequest(BaseModel):
    detection_result: str

def extract_food_names(detection_result):
    """Extract individual food names from the detection result string"""
    lines = detection_result.split('\n')
    food_names = []
    
    for line in lines:
        line = line.strip()
        # Skip empty lines and lines with nutrition keywords
        if not line or any(keyword in line.lower() for keyword in ['calories:', 'fats:', 'proteins:', 'carbohydrates:', 'identify', 'calculate', 'estimate']):
            break
        
        # Skip lines that start with asterisks or contain instruction words
        if line.startswith('*') or any(word in line.lower() for word in ['nutritional values', 'per 100 grams', 'weight of']):
            continue
            
        # Extract just the food name (before quantity info) and clean it
        food_name = re.split(r'\d+|looks|around|grams|serving|flesh|per|weight', line, 1)[0].strip()
        
        # Only add if it's a reasonable food name (not too long, not empty)
        if food_name and len(food_name.split()) <= 2 and len(food_name) > 2:
            food_names.append(food_name)
    
    return food_names[:1]  # Just return the first food item found

@app.post("/detect-food")
async def detect_food(file: UploadFile = File(...)):
    os.makedirs("images", exist_ok=True)
    file_path = os.path.join("images", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = recognize_items(file_path)
    return {"result": result}

@app.post("/get-expiration")
async def get_expiration(request: ExpirationRequest):
    """Separate endpoint to get expiration dates from detection result"""
    food_names = extract_food_names(request.detection_result)
    expiration_info = []
    
    for food_name in food_names:
        expiration_data = get_food_expiration(food_name)
        if expiration_data["expiration_date"]:
            expiration_info.append(expiration_data)
    
    return {"expiration_info": expiration_info}
