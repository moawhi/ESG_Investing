"""
Server tests for authentication functionalites
Filename: auth_test.py
"""

import requests
from tests.clear import clear_users_and_portfolios
from src.server import HOST, PORT

URL = f"http://{HOST}:{PORT}/"
OK = 200
BAD_REQUEST = 400
FORBIDDEN = 403

def test_successful_register():
    """
    Test that a user successfully registers an account after giving their first name, 
    last name, an unregistered email address and a strong enough password.
    """
    clear_users_and_portfolios()
    response = requests.post(URL + "register", json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    assert response.status_code == OK

def test_too_weak_password():
    """
    Test that a user cannot register an account with a password that does not
    fulfill the requirements for a strong enough password.
    """
    clear_users_and_portfolios()
    response = requests.post(URL + "register", json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "weak"
    })
    assert response.status_code == BAD_REQUEST

def test_already_registered_email():
    """
    Test that a user cannot register an account with an email address that has
    been used to register an account with before.
    """
    clear_users_and_portfolios()
    requests.post(URL + "register", json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    response = requests.post(URL + "register", json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    assert response.status_code == BAD_REQUEST

def test_successful_login():
    """
    Test that a user can log in to their account using their correct credentials.
    """
    clear_users_and_portfolios()
    requests.post(URL + "register", json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    response = requests.post(URL + "login", json={
        "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    assert response.status_code == OK

def test_incorrect_email_login():
    """
    Test that a user cannot log in to their account if their email is incorrect.
    """
    clear_users_and_portfolios()
    requests.post(URL + "register", json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    response = requests.post(URL + "login", json={
        "email_address": "smith@gmail.com", "password": "EsgTime1@"
    })
    assert response.status_code == BAD_REQUEST

def test_incorrect_password_login():
    """
    Test that a user cannot log in to their account if their password is incorrect.
    """
    clear_users_and_portfolios()
    requests.post(URL + "register", json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    response = requests.post(URL + "login", json={
        "email_address": "jsmith@gmail.com", "password": "wrong"
    })
    assert response.status_code == BAD_REQUEST

def test_block_account():
    """
    Test that a user gets blocked from their account if there are multiple failed
    login attempts.
    """
    clear_users_and_portfolios()
    requests.post(URL + "register",json={
        "first_name": "Jane", "last_name": "Smith", "email_address": "jsmith@gmail.com", "password": "EsgTime1@"
    })
    for i in range(3):
        requests.post(URL + "login", json={
            "email_address": "jsmith@gmail.com", "password": f"{i}"
        })
    response = requests.post(URL + "login", json={
            "email_address": "jsmith@gmail.com", "password": "wrong"
    })
    assert response.status_code == FORBIDDEN
        
