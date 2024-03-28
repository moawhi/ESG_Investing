"""
Functions related to encryption
"""

import bcrypt
import datetime
import jwt

SECRET_KEY = "your_secret_key"  # Generate a secure secret key
ALGORITHM = "HS256"
FORBIDDEN = 403

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_jwt(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        "iat": datetime.datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return {
            "status": "fail",
            "message": "Invalid token",
            "code": FORBIDDEN
        }
 