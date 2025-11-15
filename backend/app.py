from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil, os
from test_image_detection import recognize_items  # import your function

app = FastAPI()

# Allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/detect-food")
async def detect_food(file: UploadFile = File(...)):
    os.makedirs("images", exist_ok=True)
    file_path = os.path.join("images", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = recognize_items(file_path)
    return {"result": result}
