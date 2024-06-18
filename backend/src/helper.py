"""
Helper functions
Filename: helper.py

Functions:
    - verify_token
    - get_dictionary_index_in_list
    - get_user_id_from_token
    - prompt_for_missing_field
"""

from backend.src.encryption import decode_jwt
import datetime
import mysql.connector

BAD_REQUEST = 400
FORBIDDEN = 403

def verify_token(token):
    """
    Check whether a token is valid

    Parameters:
        token (JSON object): the token of a user

    Returns:
        bool: True if the token is valid, otherwise False
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
            now_timestamp = int(now.timestamp())
            
            if (decoded_token["user_id"],) not in users or now_timestamp > decoded_token["exp"]:
                return False 
            return True

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def get_dictionary_index_in_list(dict_list, key, value):
    """
    Get the index of a dictionary in a list given a key-value pairing
    """
    for dictionary in dict_list:
        if dictionary.get(key) == value:
            return dict_list.index(dictionary)
        
def get_user_id_from_token(token):
    """
    Gets the user id from a valid token
    """
    return decode_jwt(token)["user_id"]

def prompt_for_missing_field(user_inputs):
    """
    Returns a message to fill in all fields if any fields are empty
    """
    for field in user_inputs.keys():
        if not user_inputs[field]:
            return {
                "status": "fail",
                "message": "Please fill in all fields",
                "code": BAD_REQUEST
            }
