# models.py
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
from mongoengine import (
    connect,
    Document,
    StringField,
    UUIDField,
    DateTimeField,
    ReferenceField
)
import certifi

# Load .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

# Connect with certifi SSL
CA = certifi.where()
connect(
    db=MONGO_DB,
    host=MONGO_URI,
    tlsCAFile=CA
)

# -----------------------------
# User Model
# -----------------------------
class User(Document):
    user_id = UUIDField(primary_key=True, default=uuid.uuid4)
    username = StringField(required=True, unique=True)
    name = StringField(required=True)
    password = StringField(required=True)  # Use hashed passwords in production

    meta = {"collection": "users"}

# -----------------------------
# Food Model
# -----------------------------
class Food(Document):
    user = ReferenceField(User, required=True)
    name = StringField(required=True)
    quantity = StringField(required=True, choices=("small", "medium", "large"))
    expiration_date = DateTimeField(required=True)

    meta = {"collection": "food"}
