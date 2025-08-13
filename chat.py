import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load env
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set")

# OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# DB setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(50))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title='Chat Service')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    model: str | None = None

class ChatResponse(BaseModel):
    reply: str

@app.post('/chat', response_model=ChatResponse)
async def chat(req: ChatRequest):
    db = SessionLocal()

    try:
        # 1. Lấy toàn bộ lịch sử hội thoại từ DB
        history_records = db.query(ChatHistory).order_by(ChatHistory.created_at.asc()).all()
        history_msgs = [{"role": h.role, "content": h.content} for h in history_records]

        # 2. Thêm tin nhắn mới của user vào ngữ cảnh
        for m in req.messages:
            history_msgs.append({"role": m.role, "content": m.content})

        model = req.model or 'gpt-4o-mini'

        # 3. Gửi yêu cầu đến OpenAI với toàn bộ hội thoại
        resp = client.chat.completions.create(
            model=model,
            messages=history_msgs,
            max_tokens=800,
            temperature=0.2,
        )
        reply = resp.choices[0].message.content

        # 4. Lưu tin nhắn mới của user & phản hồi của assistant vào DB
        for m in req.messages:
            db.add(ChatHistory(role=m.role, content=m.content))
        db.add(ChatHistory(role="assistant", content=reply))
        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'Chat failed: {e}')
    finally:
        db.close()

    return ChatResponse(reply=reply)