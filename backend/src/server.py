"""
Server
"""

from backend.src import auth
from flask import Flask, request
from json import dumps

app = Flask(__name__)
HOST = "127.0.0.1"
PORT = 12345

@app.route("/", methods=["POST"])
def login():
    info = request.get_json()
    email = info["email_address"]
    password = info["password"]
    return dumps(auth.auth_login(email, password))

@app.route("/logout", methods=["POST"])
def logout():
    return dumps(auth.auth_logout())

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)
