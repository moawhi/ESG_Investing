"""
Server
"""

from flask import Flask, request

app = Flask(__name__)
HOST = "127.0.0.1"
PORT = 12345

@app.route("/")
def temp():
    return "<h1>Hello, world</h1>"

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)
