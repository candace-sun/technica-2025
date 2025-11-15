from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil, os
from test_image_detection import recognize_items, generate_zero_waste_recipe

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# check waht kind of food you have
@app.post("/detect-food")
async def detect_food(file: UploadFile = File(...)):
    os.makedirs("images", exist_ok=True)
    file_path = os.path.join("images", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    items = recognize_items(file_path)
    if not items.items:
        return {"result": "Food could not be detected."}

    # Optionally strip expiration from output if needed
    result_list = [
        {"name": f.name, "quantity": f.quantity, "expiration": str(f.expiration)}
        for f in items.items
    ]
    return {"result": result_list}


# create a (zero waste) recipe
@app.post("/zero-waste-recipe")
async def zero_waste_recipe(file: UploadFile = File(...)):
    os.makedirs("images", exist_ok=True)
    file_path = os.path.join("images", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
 
    result = generate_zero_waste_recipe(file_path)
    return {"result": result}

