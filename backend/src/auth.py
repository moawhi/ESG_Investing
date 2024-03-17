"""
Authentication functions

"""

import mysql.connector
import re

def auth_register(first_name, last_name, email, password):
    """
    User creates a new account with their first name, last name, email and password
    If email is already registered, no new account is created

    """
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
        INSERT INTO user (first_name, last_name, email_address, password)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (first_name, last_name, email, password))
        db.commit()
        return {"status": "success", "user_id": cursor.lastrowid}
    except Exception as err:
        print(f"Error: {err}")
        return {"status": "fail", "message": str(err)}
    finally:
        if db.is_connected():
            db.close()

def auth_login(email, password):
    """
    User logs in to account using email and password
    """
    db = None
    try:
        db = mysql.connector.connect(user="esg",
                                     password="esg",
                                     host="127.0.0.1",
                                     database="esg_management")
        
        query = """
            SELECT id, email_address, password
            FROM user
            WHERE email_address = %s
        """
        
        with db.cursor() as cur:
            cur.execute(query, [email])
            result = cur.fetchone()
            if result is None:
                return {
                    "status": "fail",
                    "message": "Incorrect username or password."
                } 
            (id, user_email, user_password) = result
            if password != user_password:
                return {
                    "status": "fail",
                    "message": "Incorrect username or password."
                } 

            if password == user_password:
                return {
                    "id": id,
                    "status": "success"
                } 
            
    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db:
            db.close()
    
def auth_logout():
    """
    User logs out of account
    """
    return {}

def auth_block_account(email, password):
    """
    User is blocked from their account after multiple failed login attempts. An
    incorrect email or password causes a failed login attempt. 
    
    If an incorrect password is provided a certain number of times for a valid
    registered email, the account created using that email will be blocked.

    The user's account is blocked until the user recovers it.
    """
    pass

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