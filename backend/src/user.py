"""
User functions
Filename: user.py

Functions:
    user_update_details
    user_update_password
"""

import mysql.connector
from backend.src.auth import auth_check_password_strength
from backend.src.encryption import hash_password
from backend.src.helper import verify_token, get_user_id_from_token

BAD_REQUEST = 400
FORBIDDEN = 403

def user_update_details(token, first_name, last_name, email_address):
    """
    Updates the user's details. The details that may be updated are first name, last
    name and/or email address.
    
    Parameters:
        token (JSON object): the user's token
        first_name (string): the user's first name
        last_name (string): the user's last name
        email_address (string): the user's email address

    Returns:
        dict: message of successful update if successful, message of failure if invalid token
    """
    if not verify_token(token):
        return {
            "status": "fail",
            "message": "Invalid token",
            "code": FORBIDDEN
        }

    db = None
    try:
        db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")

        query = """
            UPDATE user
            SET first_name = %s, last_name = %s, email_address = %s
            WHERE id = %s
        """
        with db.cursor() as cur:
            user_id = get_user_id_from_token(token)
            cur.execute(query, [first_name, last_name, email_address, user_id])
            db.commit()

            return {
                "status": "success",
                "message": "Successfully updated your details"
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def user_update_password(token, password):
    """
    Updates the user's password.

    Parameters:
        token (JSON object): the user's token
        password (string): the user's password

    Returns:
        dict: message of successful update if successful,
            message of failure if invalid token or if password is not strong enough
    """
    if not verify_token(token):
        return {
            "status": "fail",
            "message": "Invalid token",
            "code": FORBIDDEN
        }

    if not auth_check_password_strength(password):
        return {
            "status": "fail",
            "message": "Password does not meet the requirements",
            "code": BAD_REQUEST
        }

    db = None
    try:
        db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")

        query = """
            UPDATE user
            SET password = %s
            WHERE id = %s
        """
        with db.cursor() as cur:
            user_id = get_user_id_from_token(token)
            hashed_password = hash_password(password)
            cur.execute(query, [hashed_password, user_id])
            db.commit()

            return {
                "status": "success",
                "message": "Successfully updated your password"
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()
