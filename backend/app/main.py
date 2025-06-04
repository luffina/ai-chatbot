from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import openai

# Load .env file
load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI app
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic request model
class Query(BaseModel):
    question: str

# API endpoint
@app.post("/ask")
async def ask_openai(query: Query):
    try:
        # Basic greeting handling
        if query.question.strip().lower() in ["hi", "hello", "hey"]:
            return {"answer": "👋 Hello! I'm your RMIT Support Assistant. Ask me anything about enrolment, support, or student life."}

        # OpenAI Chat API call
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful and professional assistant at RMIT University. Keep answers short, clear, and helpful. Add links to official RMIT pages when useful."},
                {"role": "user", "content": query.question}
            ]
        )
        return {"answer": response.choices[0].message.content}

    except Exception as e:
        return {"answer": f"⚠️ OpenAI API error: {str(e)}"}

# Optional: Serve frontend build (if deployed full-stack)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

@app.get("/")
def read_root():
    return FileResponse("app/static/index.html")
