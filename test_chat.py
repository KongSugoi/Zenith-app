import requests

url = "http://18.215.161.7:531/chat"

payload = {
    "messages": [
        {"role": "user", "content": "Cháu có thể nói lại lịch được không, bác không nhớ rõ"}
    ]
}

try:
    r = requests.post(url, json=payload)
    r.raise_for_status()
    print(r.json())
except Exception as e:
    print(e)
    print(r.text)
