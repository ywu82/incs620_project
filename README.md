# INCS 620 OSS Project Demostration

## Dependency installation for the Tracking System

To run the Tracking System (Flask + MongoDB Atlas) properly, you need to install the following Python dependencies.

### Step 1 — Create a `requirements.txt`

```bash
nano requirements.txt
```

### Step 2 — Add the following content to `requirements.txt`:

``` txt
flask
pymongo
dnspython
```

### Step 3 — Install all dependencies using `pip`

```bash
pip install -r requirements.txt
```

## Fuzzing

### Step 1 - Fuzzing to get the API

```bash
ffuf -u http://127.0.0.1:5000/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api.txt​
```

Reference:​
SecLists/Discovery/Web-Content/api/api-endpoints.txt at master · danielmiessler/SecLists


### Step 2 - Get payload from browser Dev tool

### Step 3 - Fuzzing to get other tracking info  

```bash
ffuf -u http://127.0.0.1:5000/api/login \​
-X POST \​
-H "Content-Type: application/json" \​
-d '{"username":"bob@outlook.com","password":“bob2025","track_id":"FUZZ"}' \​
-w track_ids.txt \​
-mc 200
```