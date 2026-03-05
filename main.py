from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
from dotenv import load_dotenv

# Add the local langchain framework to Python path to act as the "DocMind" engine
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'langchain', 'libs', 'core')))

load_dotenv(override=True)
print("DEBUG API KEY:", os.getenv("GOOGLE_API_KEY"))

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.messages import HumanMessage, SystemMessage
    LLM_AVAILABLE = True
except ImportError:
    LLM_AVAILABLE = False

app = FastAPI(title="DocMind API", description="API for the DocMind RAG Framework")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    
class ChatResponse(BaseModel):
    response: str
    status: str = "success"

@app.get("/")
def read_root():
    return {"status": "DocMind API is running!"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        user_message = req.message
        
        if not LLM_AVAILABLE:
            return ChatResponse(response="DocMind Engine: I am currently installing my neural dependencies. Please wait a moment and try again!")

        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
             return ChatResponse(response="DocMind Engine: My neural link is offline due to a missing API Key.\n\nPlease open `d:\\DocMind (RAG)\\docmind-web-app\\.env` and set your `GOOGLE_API_KEY` to connect me!")
        
        # Connect to real Google Gemini engine
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)
        
        messages = [
            SystemMessage(content="You are DocMind, an advanced RAG AI Assistant. Be highly helpful, precise, and concise in your responses."),
            HumanMessage(content=user_message)
        ]
        
        result = llm.invoke(messages)
        
        return ChatResponse(response=result.content)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
