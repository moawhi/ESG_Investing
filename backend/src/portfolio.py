"""
Portfolio functions

Functions:
portfolio_save_company
portfolio_delete_company
"""

import mysql.connector
from backend.src.helper import verify_token, get_user_id_from_token

BAD_REQUEST = 400
FORBIDDEN = 403

def portfolio_save_company(token, company_id, investment_amount, comment):
    """
    Save a company to the user's portfolio
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
            REPLACE INTO user_portfolio (user_id, company_id, investment_amount, comment)
            VALUES (%s, %s, %s, %s)
        """
        user_id = get_user_id_from_token(token)
        with db.cursor() as cur:
            cur.execute(query, [user_id, company_id, investment_amount, comment])
            db.commit()

            return {
                "status": "success",
                "message": "Successfully saved to your portfolio"
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def portfolio_delete_company(token, company_id):
    """
    Delete a company from the user's portfolio
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
            DELETE FROM user_portfolio
            WHERE user_id = %s AND company_id = %s
        """
        with db.cursor() as cur:
            user_id = get_user_id_from_token(token)
            cur.execute(query, [user_id, company_id])
            db.commit()

            return {
                "status": "success",
                "message": "Successfully deleted from your portfolio"
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()


