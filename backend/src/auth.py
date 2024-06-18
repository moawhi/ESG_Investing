"""
Authentication functions
Filename: auth.py

Functions:
    - auth_register
    - auth_login
    - auth_logout
    - auth_block_account
    - auth_unblock_account
    - auth_check_password_strength
    - auth_check_registered_email
"""

import mysql.connector
import re
import datetime
from backend.src.encryption import *
from backend.src.helper import verify_token, prompt_for_missing_field

LOGIN_ATTEMPT_LIMIT = 3
BAD_REQUEST = 400
FORBIDDEN = 403
BLOCK_TIME = 1 # Block users for 1 minute

def auth_register(first_name, last_name, email, password):
    """
    User creates a new account with their first name, last name, email and password
    If email is already registered, no new account is created

    Parameters:
        first_name (string): the user's first name
        last_name (string): the user's last name
        email (string): the user's email address
        password (string): the user's password

    Returns:
        dict: the user's ID, first name, last name and token and a success status
        if successful register, otherwise returns a message of the corresponding 
        error if unsuccessful register
    """
    if prompt_for_missing_field(locals()):
        return prompt_for_missing_field(locals())

    hashed_password = hash_password(password)  # Encrypt the password using bcrypt

    # Validate the password strength
    if not auth_check_password_strength(password):
        return {"status": "fail", "message": "Password does not meet the requirements"}

    # Check if the email is already registered
    if auth_check_registered_email(email):
        return {"status": "fail", "message": "Email is already registered"}

    # Connect to the database
    db = mysql.connector.connect(
        user="esg",
        password="esg",
        host="127.0.0.1",
        database="esg_management"
    )

    try:
        cursor = db.cursor()
        query = """
        INSERT INTO user (first_name, last_name, email_address, password, blocked, login_attempts)
        VALUES (%s, %s, %s, %s, FALSE, 0)
        """
        cursor.execute(query, (first_name, last_name, email, hashed_password))
        db.commit()
        user_id = cursor.lastrowid
        token = generate_jwt(user_id)
        return {
            "status": "success",
            "user_id": user_id, 
            "token": token,
            "first_name": first_name,
            "last_name": last_name,
            "email": email}
    except Exception as err:
        print(f"Error: {err}")
        return {"status": "fail", "message": str(err)}
    finally:
        if db.is_connected():
            db.close()

def auth_login(email, password):
    """
    Logs in a user.

    Parameters:
        email (string): the user's email
        password (string): the user's password

    Returns:
        dict: the user's ID, first name, last name and token
        and success status if successful login, otherwise returns a message of
        the corresponding error if unsuccessful login
    """
    if prompt_for_missing_field(locals()):
        return prompt_for_missing_field(locals())
    
    db = None
    try:
        db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")
        
        query = """
            SELECT id, first_name, last_name, password, blocked, login_attempts, last_login
            FROM user
            WHERE email_address = %s
        """
        increase_login_attempts = """
            UPDATE user
            SET login_attempts = login_attempts + 1
            WHERE id = %s
        """
        reset_login_attempts = """
            UPDATE user
            SET login_attempts = 0
            WHERE id = %s
        """
        update_last_login = """
            UPDATE user
            SET last_login = %s
            WHERE id = %s
        """
        
        with db.cursor() as cur:
            cur.execute(query, [email])
            result = cur.fetchone()
            now = datetime.datetime.now()
            if result is None:
                return {"status": "fail", "message": "Incorrect email or password", "code": BAD_REQUEST}
            (id, first_name, last_name, hashed_password, blocked, login_attempts, last_login) = result

            if blocked:
                if now >= last_login + datetime.timedelta(minutes=BLOCK_TIME):
                    auth_unblock_account(id)
                    cur.execute(reset_login_attempts,[id])
                    db.commit()
                else:
                    return {"status": "fail", "message": "Your account is blocked. Please try again later.", "code": FORBIDDEN}
            if login_attempts >= LOGIN_ATTEMPT_LIMIT:
                return auth_block_account(id)
            
            cur.execute(update_last_login, [now, id])
            db.commit()
            if not verify_password(password, hashed_password):
                cur.execute(increase_login_attempts, [id])
                db.commit()
                return {"status": "fail", "message": "Incorrect email or password", "code": BAD_REQUEST}
                
            cur.execute(reset_login_attempts, [id])
            db.commit()
            token = generate_jwt(id)
            return {
                "user_id": id,
                "status": "success",
                "token": token,
                "first_name": first_name,
                "last_name": last_name,
                "email": email
            }
            
    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()
 
def auth_logout(token):
    """
    User logs out of account

    Parameters:
        token (JSON object): the user's token

    Returns:
        dict: empty dict on successful logout, otherwise returns a message for
        invalid token if unsuccessful logout
    """    
    if not verify_token(token):
        return {
            "status": "fail",
            "message": "Invalid token",
            "code": FORBIDDEN
        }
    return {}

def auth_block_account(user_id):
    """
    User is blocked from their account after multiple failed login attempts. An
    incorrect email or password causes a failed login attempt. If an incorrect password
    is provided a certain number of times for a valid registered email,
    the account created using that email will be blocked for a set amount of time.

    Parameters:
        user_id (int): the user's id

    Returns:
        dict: message that the user's account has been blocked
    """
    db = None
    try:
        db = mysql.connector.connect(user="esg",
                                     password="esg",
                                     host="127.0.0.1",
                                     database="esg_management")
        
        query = """
            UPDATE user
            SET blocked = TRUE, login_attempts = 0
            WHERE id = %s
        """
        
        with db.cursor() as cur:
            cur.execute(query, [user_id])
            db.commit()
            return {
                "status": "fail",
                "message": "Your account has been blocked. Please try again in 1 minute.",
                "code": FORBIDDEN
            } 
            
    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def auth_unblock_account(user_id):
    """
    Unblock a user after the blocking period has passed.

    Parameters:
        id (int): the user's id
    """
    db = None
    try:
        db = mysql.connector.connect(user="esg",
                                     password="esg",
                                     host="127.0.0.1",
                                     database="esg_management")
        
        query = """
            UPDATE user
            SET blocked = FALSE
            WHERE id = %s
        """
        
        with db.cursor() as cur:
            cur.execute(query, [user_id])
            db.commit()
            
    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def auth_check_password_strength(password):
    """
    Checks that the strength of the password is strong enough.
    A password should have:
    - at least 1 upper case letter
    - at least 1 lower case letter
    - at least 1 number
    - at least 1 special character
    - at least 8 characters

    Parameters:
        password (string): the user's password

    Returns:
        bool: True if the password meets the requirements, otherwise False
    """
    if (len(password) < 8 or
            not re.search("[a-z]", password) or
            not re.search("[A-Z]", password) or
            not re.search("[0-9]", password) or
            password.isalnum()):
        return False
    return True

def auth_check_registered_email(email):
    """
    Checks that the email has not been used to register already.

    Parameters:
        email (string): the user's email

    Returns:
        bool: True if the email has been registered already, otherwise False
    """
    db = mysql.connector.connect(
        user="esg",
        password="esg",
        host="127.0.0.1",
        database="esg_management"
    )
    cursor = db.cursor()
    query = "SELECT COUNT(*) FROM user WHERE email_address = %s"
    cursor.execute(query, (email,))
    (count,) = cursor.fetchone()
    db.close()
    return count > 0