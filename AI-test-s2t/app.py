from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq, pipeline
import torch
import tempfile

app = Flask(__name__)
CORS(app)

# Load PhoWhisper model
device = "cuda" if torch.cuda.is_available() else "cpu"
model_id = "vinai/PhoWhisper-small"

processor = AutoProcessor.from_pretrained(model_id)
model = AutoModelForSpeechSeq2Seq.from_pretrained(model_id).to(device)

asr = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    device=0 if device == "cuda" else -1
)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({"error": "Thiếu file audio"}), 400

    audio = request.files['audio']

    # Lưu file tạm thời
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmpfile:
        audio.save(tmpfile.name)
        result = asr(tmpfile.name)

    return jsonify({"text": result["text"]})

if __name__ == '__main__':
    app.run(debug=True)
