"""
Server
"""

from backend.src import auth
from flask import Flask, request, jsonify
from flask_cors import CORS
from json import dumps

app = Flask(__name__)
CORS(app)
HOST = "127.0.0.1"
PORT = 12345

@app.route("/register", methods=["POST"])
def register():
    info = request.get_json()
    first_name = info["first_name"]
    last_name = info["last_name"]
    email = info["email_address"]
    password = info["password"]

    try:
        user_id = auth.auth_register(first_name, last_name, email, password)
        return dumps({"status": "success", "user_id": user_id}), 200
    except ValueError as e:
        return dumps({"status": "error", "message": str(e)}), 400

@app.route("/", methods=["POST"])
def login():
    info = request.get_json()
    email = info["email_address"]
    password = info["password"]
    login_response = auth.auth_login(email, password)
    if login_response.get("code"):
        return jsonify(login_response), login_response.get("code")
    return jsonify(auth.auth_login(email, password))

@app.route("/logout", methods=["POST"])
def logout():
    return dumps(auth.auth_logout())

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)
