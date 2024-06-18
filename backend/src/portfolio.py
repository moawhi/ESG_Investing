"""
Portfolio functions
Filename: portfolio.py

Functions:
    - portfolio_save_company
    - portfolio_delete_company
    - portfolio_list
    - portfolio_edit
    - portfolio_calculate_esg_score
"""

import mysql.connector
from backend.src.helper import verify_token, get_user_id_from_token
from backend.src.framework import framework_list, get_esg_data_for_company_and_framework
from backend.src.company import company_calculate_esg_score

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

def portfolio_list(token):
    """
    Gets all saved companies and relevant details in the user's portfolio
    Details include company id, company name, ESG rating, ESG scores for each
    framework, industry ranking, investment amount and comment.
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
            SELECT c.perm_id, c.name, c.industry, c.esg_rating, c.industry_ranking, p.investment_amount, p.comment
            FROM user_portfolio p
                JOIN company c ON (c.perm_id = p.company_id)
            WHERE user_id = %s
        """
        portfolio_companies = []
        with db.cursor() as cur:
            user_id = get_user_id_from_token(token)
            cur.execute(query, [user_id])
            for company in cur.fetchall():
                (company_id, company_name, industry, esg_rating, industry_ranking, investment_amount, comment) = company
                details = {
                    "company_id": company_id,
                    "company_name": company_name,
                    "industry": industry,
                    "esg_rating": esg_rating,
                    "industry_ranking": industry_ranking,
                    "investment_amount": investment_amount,
                    "comment": comment
                }

                frameworks = framework_list(token, company_id)["frameworks"]
                for framework in frameworks:
                    framework_name = framework["name"]
                    framework_id = framework["framework_id"]
                    esg_data = get_esg_data_for_company_and_framework(company_id, framework_id)["esg_data"]
                    esg_score = company_calculate_esg_score(token, esg_data)["esg_score"]
                    framework_esg_score = {
                        f"esg_score_{framework_name}": esg_score
                    }
                    details.update(framework_esg_score)

                portfolio_companies.append(details)

            return {
                "status": "success",
                "portfolio": portfolio_companies
            }
            
    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def portfolio_edit(token, company_id, investment_amount, comment):
    """
    Edits investment amount and/or comment for a company in the user's portfolio
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
            UPDATE user_portfolio
            SET investment_amount = %s, comment = %s
            WHERE user_id = %s and company_id = %s
        """
        with db.cursor() as cur:
            user_id = get_user_id_from_token(token)
            cur.execute(query, [investment_amount, comment, user_id, company_id])
            db.commit()

            return {
                "status": "success",
                "message": "Successfully updated"
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def portfolio_calculate_esg_score(token):
    """
    Calculates the ESG score for the user's portfolio
    The ESG score is calculated as:
        the sum of (company investment amount / total investment in portfolio) * company ESG rating
    """
    if not verify_token(token):
        return {
            "status": "fail",
            "message": "Invalid token",
            "code": FORBIDDEN
        }
    
    portfolio_companies = portfolio_list(token)["portfolio"]
    investment_amounts = [company["investment_amount"] for company in portfolio_companies]
    total_investment = sum(investment_amounts)
    weighted_esg_scores = [(c["investment_amount"] / total_investment) * c["esg_rating"] for c in portfolio_companies]
    portfolio_esg_score = round(sum(weighted_esg_scores), 2)
    
    return {
        "esg_score": portfolio_esg_score,
        "total_investment": total_investment
    }
        
