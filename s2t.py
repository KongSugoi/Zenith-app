import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiofiles
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY chưa được cấu hình trong .env")

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title='STT Service')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscribeResponse(BaseModel):
    text: str

@app.post('/transcribe', response_model=TranscribeResponse)
async def transcribe(file: UploadFile = File(...)):
    # lưu file tạm
    tmp_path = f"/tmp/{file.filename}"
    async with aiofiles.open(tmp_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    # gọi API OpenAI Whisper
    try:
        with open(tmp_path, 'rb') as audio_file:
            resp = client.audio.transcriptions.create(
                model="gpt-4o-mini-transcribe",
                file=audio_file
            )
        text = resp.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")

    return {'text': text}