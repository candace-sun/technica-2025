# test_insert.py
from models import User, Food
from datetime import datetime, timedelta

def create_test_user():
    user = User(
        username="testuser",
        name="Test User",
        password="password123"
    )
    user.save()
    print("Created test user with ID:", user.user_id)
    return user

def create_test_food(user):
    expiration_date = datetime.now() + timedelta(days=7)

    food = Food(
        user=user,
        name="Test Banana",
        quantity="medium",
        expiration_date=expiration_date
    )
    food.save()
    print("Added food item:", food.name)

if __name__ == "__main__":
    user = create_test_user()
    create_test_food(user)
 