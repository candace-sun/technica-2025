from openai import OpenAI
from pydantic import BaseModel
import base64
from typing import List
import gradio as gr
from dotenv import load_dotenv
import os

def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)


class Food(BaseModel):
    name: str
    quantity: str

class Items(BaseModel):
    items: List[Food]

class Nutrient(BaseModel):
    steps: List[str]
    reasons: str
    kcal: str
    fat: str
    proteins: str
    carbohydrates: str


def recognize_items(image):
    """This function takes an image and returns a list of recognized food items along with their count and the nutrition. 
    """
    #first recognize items and quantities
    messages = [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": f"You are an expert in recognising individual food items and their quantity. Give count(number) for countable items and an estimate for liquid/mixed or non countable items.  For example if you have one burger,two pastries, 2 pav, bhaji and dal in an image, you return burger,pastry,pav, bhaji and dal along with the count or estimates without any duplicates. For non countable items give an estimate in grams while explaining like 'looks 1 teaspoon of sauce, so around 5-8 grams' or 'looks 1 serving of bhaji, so around 150-200gms'. Given the image below, recognise food items with their quantity.",
            }
        ],
        }
    ]

    base64_image = encode_image(image)
    dic = {
                "type": "image_url",
                "image_url": {
                    "url":  f"data:image/jpeg;base64,{base64_image}",
                    "detail": "low"
                },
            }
    messages[0]["content"].append(dic)
    response = client.beta.chat.completions.parse(
    model="gpt-4o-mini",
    messages=messages,
    response_format=Items,
    max_tokens=300,
    temperature=0.1
    )
    foods = response.choices[0].message.parsed

    res = ""
    for food in foods.items:
        res=res+food.name+ " "+food.quantity+"\n"

    #now estimate nutrition, we can use a separate model for this task
    messages = [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": f"You are an expert in estimating information regarding nutririon given the food items and thier quantities. Think step by step considering the given food items and their quantities, and give an estimated range(lowest - highest) of kcal, range(lowest - highest) of fat, range of proteins(lowest - highest) and carbohydrates(lowest - highest). Ignore contributions from minor items. Ensure your estimations are solely based on the provided quantities.  Return steps,reasons and estimations if this food was consumed. \n\nfood and quantity consumed by user: {res} \n\n.",
            }
        ],
        }
    ]
    dic = {
                "type": "image_url",
                "image_url": {
                    "url":  f"data:image/jpeg;base64,{base64_image}",
                    "detail": "low"
                },
            }
    messages[0]["content"].append(dic)
    response = client.beta.chat.completions.parse(
    model="gpt-4o-mini",
    messages=messages,
    response_format=Nutrient,
    max_tokens=500,
    temperature=0.1
    )
    nuts = response.choices[0].message.parsed
    steps = " ".join(nuts.steps)
    res=res+"\n"+steps+"\n\ncalories: "+nuts.kcal+" \nfats: "+nuts.fat+" \nproteins: "+nuts.proteins+" \ncarbohydrates: "+nuts.carbohydrates+"\n"+nuts.reasons+"\n"+"*These are estimations based on image. They might not be perfect or accurate. Please calculate based on the food you consume for a more precise estimate."
    return res


with gr.Blocks() as demo:
    foods=None
    with gr.Row():
        image_input = gr.Image(label="Upload Image",height=300,width=300,type="filepath")

    with gr.Row() as but_row:
        submit_btn = gr.Button("Detect food and quantity")

    with gr.Row() as text_responses_row: 
        text_response_1 = gr.Textbox(label="Detected food and quantity",scale=1)

    submit_btn.click(
        recognize_items,
        inputs=[image_input],
        outputs=[text_response_1]
    )

if __name__ == "__main__":
    demo.launch() 