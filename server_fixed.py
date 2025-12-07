from flask import Flask, request, jsonify, render_template, redirect, url_for

from pymongo import MongoClient

from access_control_models import abac, rbac

app = Flask(
    __name__,
    static_folder="component",
    static_url_path="/component",
    template_folder="component"  
)

MONGO_URI = "mongodb+srv://ywu82_db_user:kZDjFQSFiFURbDGl@cluster0.jjbo4qs.mongodb.net/?appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["project"]
users_col = db["user"]
orders_col = db["order"]
admin_col = db["admin"]

@app.route("/login", methods=["GET"])
def login_page():
    return render_template("login/login.html")

@app.route("/")
def index():
    return redirect(url_for("login_page"))

@app.route("/api/login", methods=["POST"])
def login_api():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    track_id = data.get("track_id")

    if not username or not password:
        return jsonify({"success": False, "msg": "Username or password cannot be empty"}), 400

    if not track_id:
        return jsonify({"success": False, "msg": "Tracking ID cannot be empty"}), 400

    # user = admin_col.find_one({
    #     "name": username,
    #     "password": password
    # })
    # use rabac herer
    admin = rbac (admin_col, username, password)
    # if not user:
    if not admin:
        user = users_col.find_one({
                "name": username,
                "password": password
            })

        if not user:
            return jsonify({"success": False, "msg": "Incorrect username or password"}), 401

    if not admin:
        # if not admin use abac here
        order = abac(orders_col, username, track_id)
    else:
        order = orders_col.find_one({"orderId": track_id})

    if not order:
        return jsonify({
            "success": False,
            "msg": f"No order found for Tracking ID {track_id}"
        }), 404

    order["_id"] = str(order["_id"])

    # If you want the frontend to access the current user, you can return it as well
    return jsonify({
        "success": True,
        "msg": "Login successful",
        "user": {"name": username},
        "order": order
    }), 200

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard/dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)
