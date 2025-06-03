 
import json

def load_knowledge_base(file_path: str):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

def build_prompt(knowledge_data, user_question: str) -> str:
    context = "\n".join([f"Q: {item['question']}\nA: {item['answer']}" for item in knowledge_data])
    prompt = (
        "You are a helpful assistant for new RMIT students. Use the information below to answer questions:\n\n"
        f"{context}\n\nUser: {user_question}\nAssistant:"
    )
    return prompt
