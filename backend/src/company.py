"""
Company functions
"""

import mysql.connector
from backend.src.helper import verify_token, get_dictionary_index_in_list

BAD_REQUEST = 400
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

def get_company_details(company_id):
    """
    Fetches details of a specific company, including its ESG score, ranking within its industry, and other details.
    """
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

def company_calculate_esg_score(token, esg_data):
    """
    Calculates the ESG score for a company for currently selected metrics, indicators,
    weights and years.
    The weighted score for each indicator is calculated using:
    weighted score = indicator ESG score * framework metric weight * indicator weight.
    If multiple years are selected, the weighted score for each year for an indicator
    is calculated, and all the weighted scores for the indicator are averaged.
    The final ESG score is the sum of all the averaged weighted scores, i.e.
    the final ESG score is the average of all ESG scores for selected years.
    """
    if not verify_token(token):
        return {
            "status": "fail",
            "message": "Invalid token",
            "code": FORBIDDEN
        }
    if not esg_data:
        return {
            "status": "fail",
            "message": "There was an error handling the ESG data",
            "code": BAD_REQUEST
        }
    
    averaged_weighted_scores = []
    for framework_metric in esg_data:
        for indicator in framework_metric["indicators"]:
            scores = [score[1] for score in indicator.items() if "indicator_score" in score[0]]
            fm_weight = framework_metric["framework_metric_weight"]
            i_weight = indicator["indicator_weight"]
            scores = [score * fm_weight * i_weight for score in scores]
            average_weighted_score = sum(scores) / len(scores)
            averaged_weighted_scores.append(average_weighted_score)

    esg_score = sum(averaged_weighted_scores)

    return {
        "esg_score": esg_score
    }
