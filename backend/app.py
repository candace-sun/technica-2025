from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import shutil
from test_image_detection import recognize_items, generate_zero_waste_recipe
from models import User, Food
from datetime import datetime, timedelta
import uuid 
from expiration_helper import get_food_expiration, fallback_expiration
from receipt_parser import parse_receipt

# CRUD TO DB!!

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# need image, user, then adds food based on image
@app.route("/detect-food", methods=["POST"])
def detect_food():
    # --- USER ID REQUIRED ---
    user_id = request.form.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    # UUID lookup
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user_id format"}), 400

    user = User.objects(id=user_uuid).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # --- FILE HANDLING ---
    if "file" not in request.files:
        return jsonify({"result": "No file uploaded"}), 400

    file = request.files["file"]
    os.makedirs("images", exist_ok=True)
    file_path = os.path.join("images", file.filename)
    file.save(file_path)

    # --- RUN IMAGE DETECTION ---
    items = recognize_items(file_path)
    if not items.items:
        return jsonify({"result": "Food could not be detected."})

    saved_items = []  # IMPORTANT

    for f in items.items:
        name = f.name or "Unknown"
        quantity = (f.quantity or "medium").lower()
        if quantity not in ("small", "medium", "large"):
            quantity = "medium"

        # --- EXPIRATION DATE ---
        exp_info = get_food_expiration(name)
        expiration_date = exp_info.get("expiration_date")

        # fallback if nothing returned
        if not expiration_date:
            expiration_date = fallback_expiration(name)

        # --- SAVE TO DATABASE ---
        food = Food(
            user=user,
            name=name,
            quantity=quantity,
            expiration_date=expiration_date
        )
        food.save()

        saved_items.append({
            "name": name,
            "quantity": quantity,
            "expiration_date": expiration_date.isoformat(),
            "food_id": str(food.id)
        })

    return jsonify({
        "result": "success",
        "items_saved": saved_items
    })

# parse receipt similar to function above
@app.route("/parse-receipt", methods=["POST"])
def parse_receipt_route():
    # 1️⃣ user_id required
    user_id = request.form.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        user_uuid = uuid.UUID(user_id)
        user = User.objects(id=user_uuid).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
    except ValueError:
        return jsonify({"error": "Invalid user_id format"}), 400

    # 2️⃣ file required
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    os.makedirs("receipts", exist_ok=True)
    file_path = os.path.join("receipts", file.filename)
    file.save(file_path)

    # 3️⃣ parse receipt using utility
    parsed_data = parse_receipt(file_path)
    raw_items = parsed_data.get("items", [])

    saved_items = []
    for item in raw_items:
        name = item.get("name", "Unknown")
        quantity = item.get("quantity", "medium").lower()
        if quantity not in ("small", "medium", "large"):
            quantity = "medium"

        expiration_date = get_food_expiration(name).get("expiration_date") or fallback_expiration(name)

        food_obj = Food(
            user=user,
            name=name,
            quantity=quantity,
            expiration_date=expiration_date
        )
        food_obj.save()

        saved_items.append({
            "name": name,
            "quantity": quantity,
            "expiration_date": expiration_date.isoformat(),
            "food_id": str(food_obj.id)
        })

    return jsonify({
        "store": parsed_data.get("store"),
        "date": parsed_data.get("date"),
        "items_saved": saved_items
    })
# create a (zero waste) recipe 
@app.route("/zero-waste-recipe", methods=["POST"])
def zero_waste_recipe():
    if "file" not in request.files:
        return jsonify({"result": "No file uploaded"}), 400

    file = request.files["file"]
    os.makedirs("images", exist_ok=True)
    file_path = os.path.join("images", file.filename)
    file.save(file_path)

    result = generate_zero_waste_recipe(file_path)
    return jsonify({"result": result})


# adding a user
@app.route("/add-user", methods=['POST'])
def add_user():
    data = request.json

    username = data.get("username")
    name = data.get("name")
    password = data.get("password")

    if not username or not name or not password:
        return jsonify({"result": "username, name, and password are required"}), 400

    # check for duplicates
    if User.objects(username=username).first():
        return jsonify({"result": f"User {username} already exists"}), 400

    user = User(username=username, name=name, password=password)
    user.save()

    return jsonify({"result": f"User {username} added successfully", "id": str(user.id)})

# add food
@app.route("/add-food", methods=['POST'])
def add_food():
    data = request.json

    user_id = data.get("_id")  # UUID string from client
    name = data.get("name")
    quantity = data.get("quantity")
    shelf_life_days = data.get("shelf_life", 5)

    if not user_id or not name or not quantity:
        return jsonify({"result": "_id, name, and quantity are required"}), 400

    # Convert string to UUID object
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError as e:
        return jsonify({"result": f"Invalid _id format: {e}"}), 400

    # Find user by UUID
    user = User.objects(id=user_uuid).first()
    if not user:
        return jsonify({"result": f"User {user_id} not found"}), 404

    # Create food
    expiration_date = datetime.now() + timedelta(days=shelf_life_days)
    food = Food(
        user=user,
        name=name,
        quantity=quantity,
        expiration_date=get_food_expiration(name).get("expiration_date") or fallback_expiration(name)
    )
    food.save()

    return jsonify({
        "result": f"Food {name} added for user {user.username}",
        "food_id": str(food.id),
        "expiration_date": expiration_date.strftime("%Y-%m-%d")
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000)
