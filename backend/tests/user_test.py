"""
Server tests for user functionalities
Filename: user_test.py
"""

import pytest
import requests
from tests.clear import clear_users_and_portfolios
from src.server import HOST, PORT

URL = f"http://{HOST}:{PORT}/"
OK = 200
BAD_REQUEST = 400
FORBIDDEN = 403

@pytest.fixture
def user():
    """
    Set up a user.

    Returns:
        JSON object: the user's token
    """
    clear_users_and_portfolios()
    response = requests.post(URL + "register", json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    response_return = response.json()
    return {
        "token": response_return["token"]
    }

def test_update_details_log_in_updated_email(user):
    """
    Test successful update of user details by changing email and checking that
    logging in with the updated email is successful.
    """
    response = requests.put(URL + "user/update-details", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "first_name": "Janet", "last_name": "Smith", "email_address": "janet@gmail.com" 
    })
    assert response.status_code == OK

    requests.post(URL + "logout", json={
        "token": user["token"]
    })
    login_response = requests.post(URL + "login", json={
        "email_address": "janet@gmail.com", "password": "EsgTime1@"
    })
    assert login_response.status_code == OK

def test_update_details_log_in_old_email(user):
    """
    Test successful update of user details by changing email and checking that
    logging in with the old email is unsuccessful.
    """
    response = requests.put(URL + "user/update-details", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "first_name": "Janet", "last_name": "Smith", "email_address": "janet@gmail.com" 
    })
    assert response.status_code == OK

    requests.post(URL + "logout", json={
        "token": user["token"]
    })
    login_response = requests.post(URL + "login", json={
        "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    assert login_response.status_code == BAD_REQUEST


def test_update_password(user):
    """
    Test successful update of user password and checking that logging in with 
    the updated password is successful.
    """
    response = requests.put(URL + "user/update-password", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "password": "ESGtime2!"
    })
    assert response.status_code == OK
    requests.post(URL + "logout", json={
        "token": user["token"]
    })
    login_response = requests.post(URL + "login", json={
        "email_address": "jsmith@gmail.com", "password": "ESGtime2!"
    })
    assert login_response.status_code == OK

def test_invalid_token():
    """
    Test that an invalid token for user routes causes an error.
    """
    resp1 = requests.put(URL + "user/update-details", headers={
        "Authorisation": "Bearer " + "invalid token"}, json={
        "first_name": "Janet", "last_name": "Smith", "email_address": "janet@gmail.com" 
    })
    assert resp1.status_code == FORBIDDEN

    resp2 =requests.put(URL + "user/update-password", headers={
        "Authorisation": "Bearer " + "invalid token"}, json={
        "password": "ESGtime2!"
    })
    assert resp2.status_code == FORBIDDEN

