from openai import OpenAI
from pydantic import BaseModel
import base64
from typing import List, Optional
import gradio as gr
from dotenv import load_dotenv
import os
from datetime import date, timedelta
import requests

load_dotenv()

# -------------------- Utilities --------------------
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


openai_api_key = os.getenv("OPENAI_API_KEY")
spoonacular_api_key = os.getenv("SPOONACULAR_API_KEY")  # add your key
client = OpenAI(api_key=openai_api_key)


# -------------------- Data Models --------------------
class Food(BaseModel):
    name: str
    quantity: str
    expiration: Optional[date] = date.today() + timedelta(days=1)


class Items(BaseModel):
    items: List[Food]


# -------------------- Food Recognition --------------------

def recognize_items(image_path) -> Items:
    """
    Recognize food items in an image and ensure each Food object has a valid expiration date.
    """
    base64_image = encode_image(image_path)

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": (
                        "You are an expert in recognising individual food items and their quantity. "
                        "Give count(number) for countable items and an estimate for liquid/mixed items. "
                        "Return items as name and quantity without duplicates."
                    ),
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}",
                        "detail": "low",
                    },
                },
            ],
        }
    ]

    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=messages,
        response_format=Items,
        max_tokens=300,
        temperature=0.1
    )

    foods: Items = response.choices[0].message.parsed

    for f in foods.items:
        if f.expiration is None:
            f.expiration = date.today() + timedelta(days=1)

    if not foods.items:
        foods.items.append(Food(
            name="Unknown",
            quantity="Unknown",
            expiration=date.today() + timedelta(days=1)
        ))

    return foods


# -------------------- Expiring Items --------------------
def items_expiring_soon(items: Items, days: int = 2):
    today = date.today()
    expiring_items = [
        item for item in items.items
        if item.expiration and 0 <= (item.expiration - today).days <= days
    ]
    return expiring_items


# -------------------- Spoonacular Recipe Fetching --------------------
def get_recipes(expiring_items: List[Food], number: int = 3):
    ingredients = ",".join([item.name for item in expiring_items])
    url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={ingredients}&number={number}&apiKey={spoonacular_api_key}"
    response = requests.get(url).json()
    return response  # List of recipes


# -------------------- Recipe Scaling --------------------
def scale_recipe(recipe, fridge_items: List[Food]):
    # Map recipe ingredients to fridge items
    scaling_factors = []
    for r_item in recipe['usedIngredients']:
        for f_item in fridge_items:
            if f_item.name.lower() in r_item['name'].lower():
                # Convert fridge quantity to float (g/ml)
                qty_str = f_item.quantity.replace("g","").replace("ml","").strip()
                try:
                    fridge_qty = float(qty_str)
                    recipe_qty = r_item['amount']  # Spoonacular amount
                    scaling_factors.append(fridge_qty / recipe_qty)
                except:
                    scaling_factors.append(1.0)
    scale = min(scaling_factors) if scaling_factors else 1.0

    # Apply scaling
    scaled_ingredients = []
    for r_item in recipe['usedIngredients']:
        scaled_qty = r_item['amount'] * scale
        unit = r_item['unit']
        scaled_ingredients.append(f"{r_item['name']}: {scaled_qty:.2f} {unit}")
    return scaled_ingredients


# -------------------- Zero-Waste Recipe --------------------
from datetime import date, timedelta
from typing import List
from test_image_detection import recognize_items, items_expiring_soon, get_recipes, scale_recipe, Food

def generate_zero_waste_recipe(image_path: str) -> str:
    """
    Generate a zero-waste recipe based on expiring items in the uploaded image.
    """

    recognized = recognize_items(image_path)

    expiring = items_expiring_soon(recognized)
    if not expiring:
        return "No items are expiring soon. Try regular recipes."

    expiring = [item for item in expiring if item.name.lower() != "unknown"]
    if not expiring:
        return "No valid expiring items found for recipe generation."

    normalized_ingredients = [item.name.lower().replace(" ", "-") for item in expiring]

    recipes = get_recipes(expiring)
    
    if not recipes or len(recipes) == 0:
        # Fallback message if Spoonacular returns nothing --> next best?
        ingredient_list = ", ".join([f"{item.quantity} {item.name}" for item in expiring])
        fallback_recipe = (
            "No recipes found for your expiring items. "
            f"Try combining the following items in a simple dish: {ingredient_list}. "
            "For example, make a salad, stir-fry, smoothie, or roasted veggies."
        )
        return fallback_recipe

    recipe = recipes[0]
    scaled_ingredients = scale_recipe(recipe, expiring)

    output = f"Zero-Waste Recipe: {recipe.get('title', 'Untitled')}\n\nIngredients (scaled to your fridge items):\n"
    output += "\n".join(scaled_ingredients)
    output += "\n\nInstructions: " + recipe.get('instructions', 'Refer to Spoonacular for full instructions.')

    return output



# -------------------- Gradio UI --------------------
with gr.Blocks() as demo:
    image_input = gr.Image(label="Upload Image", height=300, width=300, type="filepath")
    detect_btn = gr.Button("Detect Food & Quantity")
    zero_waste_btn = gr.Button("Generate Zero-Waste Recipe")
    output_text = gr.Textbox(label="Output", lines=15)

    detect_btn.click(
        recognize_items,
        inputs=[image_input],
        outputs=[output_text]
    )

    zero_waste_btn.click(
        generate_zero_waste_recipe,
        inputs=[image_input],
        outputs=[output_text]
    )

if __name__ == "__main__":
    demo.launch()
