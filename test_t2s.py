import requests

# URL API TTS (đổi nếu server của bạn không chạy ở localhost:8000)
API_URL = "http://18.215.161.7:7000/synthesize"

# Dữ liệu gửi lên API
payload = {
    "text": "Xin chào, đây là bài test chuyển văn bản thành giọng nói.",
    "voice": "coral",   # Có thể đổi sang giọng khác nếu OpenAI hỗ trợ
    "format": "mp3"     # Hoặc "wav"
}

# Gửi request POST
print("[*] Đang gửi yêu cầu TTS...")
response = requests.post(API_URL, json=payload)

# Kiểm tra phản hồi
if response.status_code == 200:
    filename = "output_test." + payload["format"]
    with open(filename, "wb") as f:
        f.write(response.content)
    print(f"[+] Đã lưu file âm thanh: {filename}")
else:
    print(f"[!] Lỗi: {response.status_code} - {response.text}")
