"""
Authentication functions

"""

import mysql.connector
import re
import bcrypt
import jwt
import datetime

SECRET_KEY = "your_secret_key"  # Generate a secure secret key
ALGORITHM = "HS256"
LOGIN_ATTEMPT_LIMIT = 3
BAD_REQUEST = 400
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

def auth_register(first_name, last_name, email, password):
    """
    User creates a new account with their first name, last name, email and password
    If email is already registered, no new account is created

    """
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
        return {"status": "success", "user_id": user_id, "token": token}
    except Exception as err:
        print(f"Error: {err}")
        return {"status": "fail", "message": str(err)}
    finally:
        if db.is_connected():
            db.close()

def auth_login(email, password):
    db = None
    try:
        db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")
        
        query = """
            SELECT id, email_address, password, blocked, login_attempts
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
        
        with db.cursor() as cur:
            cur.execute(query, [email])
            result = cur.fetchone()
            if result is None or not verify_password(password, result[2]):
                cur.execute(increase_login_attempts, [result[0]])
                db.commit()
                return {"status": "fail", "message": "Incorrect username or password", "code": BAD_REQUEST}

            (id, user_email, hashed_password, blocked, login_attempts) = result

            if blocked:
                return {"status": "fail", "message": "Your account is blocked", "code": FORBIDDEN}

            cur.execute(reset_login_attempts, [id])
            db.commit()
            token = generate_jwt(id)
            return {"user_id": id, "status": "success", "token": token}
            
    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()
 
def auth_logout(token):
    """
    User logs out of account
    """
    decoded_token = decode_jwt(token)
    if decoded_token.get("status") == "fail":
        return decoded_token

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
            
            if (decoded_token["user_id"],) in users and logout_time <= decoded_token["exp"]:
                return {}
            else:
                return {
                    "status": "fail",
                    "message": "Invalid token",
                    "code": FORBIDDEN
                }
            
    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def auth_block_account(id):
    """
    User is blocked from their account after multiple failed login attempts. An
    incorrect email or password causes a failed login attempt. 
    
    If an incorrect password is provided a certain number of times for a valid
    registered email, the account created using that email will be blocked.

    The user's account is blocked until the user recovers it.
    """
    db = None
    try:
        db = mysql.connector.connect(user="esg",
                                     password="esg",
                                     host="127.0.0.1",
                                     database="esg_management")
        
        query = """
            UPDATE user
            SET blocked = TRUE
            WHERE id = %s
        """
        
        with db.cursor() as cur:
            cur.execute(query, [id])
            db.commit()
            return {
                "status": "fail",
                "message": "Your account has been blocked",
                "code": FORBIDDEN
            } 
            
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
    """
    if (len(password) < 8 or
            not re.search("[a-z]", password) or
            not re.search("[A-Z]", password) or
            not re.search("[0-9]", password) or
            not re.search("[_@$]", password)):
        return False
    return True

def auth_check_registered_email(email):
    """
    Checks that the email has not been used to register already
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