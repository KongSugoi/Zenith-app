import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in environment")

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title='TTS Service')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TTSRequest(BaseModel):
    text: str
    voice: str | None = None
    format: str | None = 'wav'  # 'wav' hoặc 'mp3'

@app.post('/synthesize')
async def synthesize(req: TTSRequest):
    if not req.text:
        raise HTTPException(status_code=400, detail='No text provided')

    out_path = f"/tmp/tts_output.{req.format or 'wav'}"

    try:
        model = 'gpt-4o-mini-tts'
        voice = req.voice or 'sage'

        # Gọi API TTS của OpenAI
        with client.audio.speech.with_streaming_response.create(
            model=model,
            voice=voice,
            input=req.text,
        ) as response:
            response.stream_to_file(out_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f'TTS (OpenAI) failed: {e}')

    if not os.path.exists(out_path):
        raise HTTPException(status_code=500, detail='TTS output file not created')

    media_type = 'audio/wav' if req.format == 'wav' else 'audio/mpeg'
    return FileResponse(out_path, media_type=media_type, filename=os.path.basename(out_path))