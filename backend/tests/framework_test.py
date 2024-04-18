"""
Server tests for framework functionalities
Filename: framework_test.py
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

def test_framework_list(user):
    """
    Test that a list of frameworks is successfully returned.
    """
    response = requests.get(URL + "framework/list", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    response_return = response.json()
    assert response.status_code == OK
    assert isinstance(response_return.get("frameworks"), list)

def test_esg_data_for_company_and_framework(user, company):
    """
    Test that ESG data is successfully returned for a selected company and framework.
    """
    framework_list = requests.get(URL + "framework/list", headers={
        "Authorisation": "Bearer " + user["token"]}, params={
        "company_id": company["company_id"]
    })
    framework_id = framework_list.json()["frameworks"][0]["framework_id"]
    response = requests.get(URL + "company/esg", headers={
        "Authorisation": "Bearer " + user["token"]}, params={
        "company_id": company["company_id"], "framework_id": framework_id
    })
    assert response.status_code == OK

def test_list_metrics_not_part_of_framework():
    """
    Test that the list of metrics not part of the selected framework is successfully
    returned.
    """
    framework_id = 1
    response = requests.get(URL + f"framework/{framework_id}/unincluded-metrics")
    response_return = response.json()
    assert response.status_code == OK
    assert isinstance(response_return["metrics"], list)

def test_invalid_token(user, company):
    """
    Test that an invalid token for framework routes causes an error. 
    """
    resp1 = requests.get(URL + "framework/list", headers={
        "Authorisation": "Bearer " + "invalid token"
    })
    assert resp1.status_code == FORBIDDEN

    framework_list = requests.get(URL + "framework/list", headers={
        "Authorisation": "Bearer " + user["token"]}, params={
        "company_id": company["company_id"]
    })
    framework_id = framework_list.json()["frameworks"][0]["framework_id"]
    resp2 = requests.get(URL + "company/esg", headers={
        "Authorisation": "Bearer " + "invalid token"}, params={
        "company_id": company["company_id"], "framework_id": framework_id
    })
    assert resp2.status_code == FORBIDDEN
