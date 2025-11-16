from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import shutil
from test_image_detection import recognize_items, generate_zero_waste_recipe
from models import User, Food
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# check what kind of food you have
@app.route("/detect-food", methods=["POST"])
def detect_food():
    if "file" not in request.files:
        return jsonify({"result": "No file uploaded"}), 400

    file = request.files["file"]
    os.makedirs("images", exist_ok=True)
    file_path = os.path.join("images", file.filename)
    file.save(file_path)

    items = recognize_items(file_path)
    if not items.items:
        return jsonify({"result": "Food could not be detected."})

    result_list = [
        {"name": f.name, "quantity": f.quantity, "expiration": str(f.expiration)}
        for f in items.items
    ]
    return jsonify({"result": result_list})


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


@app.route("/add-to-db", methods=['POST'])
def add_to_db():
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



if __name__ == "__main__":
    app.run(debug=True, port=8000)
