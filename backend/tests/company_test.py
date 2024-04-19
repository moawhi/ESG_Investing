"""
Server tests for company functionalities
Filename: company_test.py
"""

import pytest
import requests
from tests.clear import clear_users_and_portfolios
from src.server import HOST, PORT

URL = f"http://{HOST}:{PORT}/"
OK = 200
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

@pytest.fixture
def company(user):
    """
    Get a company ID

    Returns:
        int: an ID of a company
    """
    response = requests.get(URL + "company/industry-company-list", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    response_return = response.json()
    company_id = response_return["industries"][0]["companies"][0]["company_id"]
    return {
        "company_id": int(company_id)
    }

def test_industry_company_list(user):
    """
    Test that the list of industries and companies within each industry is
    successfully returned.
    """
    response = requests.get(URL + "company/industry-company-list", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    assert response.status_code == OK

def test_company_details(user, company):
    """
    Test that details for a selected company are successfully returned.
    """
    response = requests.get(URL + f"company/{str(company["company_id"])}", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    assert response.status_code == OK

def test_calculate_esg_score(user, company):
    """
    Test that the calculated ESG score for a company is successfully returned.
    """
    get_esg_data = requests.get(URL + "company/esg", headers={
        "Authorisation": "Bearer " + user["token"]}, params={
        "company_id": company["company_id"], "framework_id": 1
    })
    esg_data = get_esg_data.json()["esg_data"]
    response = requests.post(URL + "company/calculate-esg-score", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
            "esg_data": esg_data
        })
    assert response.status_code == OK

def test_invalid_token(user, company):
    """
    Test that an invalid token for company routes causes an error.
    """
    resp1 = requests.get(URL + "company/industry-company-list", headers={
        "Authorisation": "Bearer " + "invalid token"
    })
    assert resp1.status_code == FORBIDDEN

    resp2 = requests.get(URL + f"company/{str(company["company_id"])}", headers={
        "Authorisation": "Bearer " + "invalid token"
    })
    assert resp2.status_code == FORBIDDEN

    get_esg_data = requests.get(URL + "company/esg", headers={
        "Authorisation": "Bearer " + user["token"]}, params={
        "company_id": company["company_id"], "framework_id": 1
    })
    esg_data = get_esg_data.json()["esg_data"]
    resp3 = requests.post(URL + "company/calculate-esg-score", headers={
        "Authorisation": "Bearer " + "invalid token"}, json={
        "esg_data": esg_data
    })
    assert resp3.status_code == FORBIDDEN


