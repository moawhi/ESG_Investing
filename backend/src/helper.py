"""
Helper functions

"""

from backend.src.encryption import decode_jwt
import datetime
import mysql.connector

FORBIDDEN = 403

def verify_token(token):
    """
    Check whether a token is valid
    """
    decoded_token = decode_jwt(token)
    if decoded_token.get("status") == "fail":
        return False

    db = None
    try:
        db = mysql.connector.connect(user="esg",
                                     password="esg",
                                     host="127.0.0.1",
                                     database="esg_management")
        
        query = """
            SELECT id
            FROM user
            """
        with db.cursor() as cur:
            cur.execute(query)
            users = cur.fetchall()
            now = datetime.datetime.now()
            logout_time = int(now.timestamp())
            
            if (decoded_token["user_id"],) not in users or logout_time > decoded_token["exp"]:
                return False 
            return True

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()
