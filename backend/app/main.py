from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import openai

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask_openai(query: Query):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful RMIT student assistant. Respond clearly, professionally, and provide support or links when needed."
                },
                {
                    "role": "user",
                    "content": query.question
                }
            ]
        )
        return {"answer": response.choices[0].message.content}
    except Exception as e:
        return {"answer": f"⚠️ OpenAI API error: {e}"}
