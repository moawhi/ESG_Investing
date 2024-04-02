import mysql.connector

def get_company_details(company_id):
    # Fetches details of a specific company, including its ESG score, ranking within its industry, and other details.
    db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")
    try:
        with db.cursor(dictionary=True) as cursor:
            # Fetch company details, ESG rating, industry, and industry ranking directly
            cursor.execute("""
                SELECT name, info, esg_rating, industry, industry_ranking
                FROM company
                WHERE perm_id = %s
            """, (company_id,))
            company_details = cursor.fetchone()

            if company_details:
                return company_details
            else:
                return {"status": "fail", "message": "Company not found."}
    finally:
        db.close()
"""
Company functions
"""

import mysql.connector
from backend.src.helper import verify_token, get_dictionary_index_in_list

FORBIDDEN = 403

def company_industry_company_list(token):
    """
    Gets all industries and for each industry lists the companies within that
    industry
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
            SELECT industry, name, perm_id
            FROM company
        """
        industries = []
        with db.cursor() as cur:
            cur.execute(query)

            for company in cur.fetchall():
                (industry, name, id) = company
                industry_companies = {
                    "type": industry,
                    "companies": []
                }
                if not any(i.get("type") == industry for i in industries):
                    industries.append(industry_companies)

                index = get_dictionary_index_in_list(industries, "type", industry)
                company_name = {
                    "name": name,
                    "company_id": id
                }
                industries[index]["companies"].append(company_name)

            return {
                "industries": industries
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()
