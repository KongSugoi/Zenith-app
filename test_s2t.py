import requests

# URL của API STT server bạn đã dựng
url = "http://18.215.161.7:5000/transcribe"


# File audio để test
file_path = "output.wav"

with open(file_path, "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)

print("Status Code:", response.status_code)
print("Response:", response.json())
