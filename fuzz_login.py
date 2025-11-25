import requests
import time

API_URL = "http://127.0.0.1:5000/api/login"

USERNAME = "bob2025@outlook.com"
PASSWORD = "bob2025"

# Read track_id list
with open("track_ids.txt", "r") as f:
    track_ids = [line.strip() for line in f.readlines() if line.strip()]

print(f"Loaded {len(track_ids)} track IDs.")

for tid in track_ids:
    payload = {
        "username": USERNAME,
        "password": PASSWORD,
        "track_id": tid
    }

    try:
        res = requests.post(API_URL, json=payload)
        data = res.json()
    except Exception as e:
        print(f"[ERROR] {tid}: {e}")
        continue

    if res.status_code == 200:
        print(f"[FOUND] {tid} → Valid order found!")
        print(data)
    else:
        print(f"[MISS] {tid} → {data.get('msg')}")
    # In case too fase access
    time.sleep(0.1)
