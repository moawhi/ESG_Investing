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

@app.route("/", methods=["POST"])
def login():
    info = request.get_json()
    email = info["email_address"]
    password = info["password"]
    #print(email, password) testing functionality, can remove later
    #response_data = auth.auth_login(email, password)
    #print("Returning response:", response_data)
    return jsonify(auth.auth_login(email, password))

@app.route("/logout", methods=["POST"])
def logout():
    return dumps(auth.auth_logout())

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)
