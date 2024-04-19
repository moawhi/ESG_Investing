"""
SErver tests for portfolio functionalities
Filename: portfolio_test.py
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

def test_save_company(user, company):
    """
    Test that a company is successfully saved to the user's portfolio.
    """
    response = requests.post(URL + "portfolio/save-company", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "company_id": company["company_id"], "investment_amount": 1000, "comment": "good"
    })
    assert response.status_code == OK

def test_portfolio_list(user, company):
    """
    Test that the list of companies and relevant details in a user's portfolio
    is returned successfully.
    """
    requests.post(URL + "portfolio/save-company", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "company_id": company["company_id"], "investment_amount": 1000, "comment": "good"
    })
    response = requests.get(URL + "portfolio/list", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    response_return = response.json()
    assert response.status_code == OK
    assert isinstance(response_return["portfolio"], list)

def test_edit_portfolio(user, company):
    """
    Test that the investment amount and comment for a company in the user's
    portfolio is successfully edited.
    """
    requests.post(URL + "portfolio/save-company", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "company_id": company["company_id"], "investment_amount": 1000, "comment": "good"
    })
    portfolio_list_response = requests.get(URL + "portfolio/list", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    portfolio_list_return = portfolio_list_response.json()
    company_id = portfolio_list_return["portfolio"][0]["company_id"]

    response = requests.put(URL + "portfolio/edit", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "company_id": company_id, "investment_amount": 2000, "comment": "nice"
    })
    assert response.status_code == OK

def test_delete_company(user, company):
    """
    Test that a company is successfully deleted from the user's portfolio.
    """
    requests.post(URL + "portfolio/save-company", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "company_id": company["company_id"], "investment_amount": 1000, "comment": "good"
    })
    portfolio_list_response = requests.get(URL + "portfolio/list", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    portfolio_list_return = portfolio_list_response.json()
    company_id = portfolio_list_return["portfolio"][0]["company_id"]

    response = requests.delete(URL + "portfolio/delete-company", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "company_id": company_id
    })
    assert response.status_code == OK

def test_calculate_portfolio_esg_score(user):
    """
    Test that the portfolio ESG score is returned successfully.
    """
    response = requests.get(URL + "portfolio/calculate-esg-score", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    assert response.status_code == OK

def test_invalid_token(user, company):
    """
    Test that an invalid token for portfolio routes cause an error.
    """
    resp1 = requests.post(URL + "portfolio/save-company", headers={
        "Authorisation": "Bearer " + "invalid token"}, json={
        "company_id": company["company_id"], "investment_amount": 1000, "comment": "good"
    })
    assert resp1.status_code == FORBIDDEN
    
    resp2 = requests.get(URL + "portfolio/list", headers={
        "Authorisation": "Bearer " + "invalid token"
    })
    assert resp2.status_code == FORBIDDEN

    requests.post(URL + "portfolio/save-company", headers={
        "Authorisation": "Bearer " + user["token"]}, json={
        "company_id": company["company_id"], "investment_amount": 1000, "comment": "good"
    })
    portfolio_list_response = requests.get(URL + "portfolio/list", headers={
        "Authorisation": "Bearer " + user["token"]
    })
    portfolio_list_return = portfolio_list_response.json()
    company_id = portfolio_list_return["portfolio"][0]["company_id"]

    resp3 = requests.delete(URL + "portfolio/delete-company", headers={
        "Authorisation": "Bearer " + "invalid token"}, json={
        "company_id": company_id
    })
    assert resp3.status_code == FORBIDDEN

    resp4 = requests.get(URL + "portfolio/calculate-esg-score", headers={
        "Authorisation": "Bearer " + "invalid token"
    })
    assert resp4.status_code == FORBIDDEN

