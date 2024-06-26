"""
Company functions
Filename: company.py

Functions:
    - company_industry_company_list
    - get_company_details
    - company_calculate_esg_score
    - check_total_framework_metric_weight
    - check_total_indicator_weight
"""

import mysql.connector
from backend.src.helper import verify_token, get_dictionary_index_in_list

BAD_REQUEST = 400
FORBIDDEN = 403
TOTAL_WEIGHT = 1
DECIMAL_PLACES = 2

def company_industry_company_list(token):
    """
    Gets all industries and for each industry lists the companies within that
    industry.

    Parameters:
        token (JSON object): the user's token

    Returns:
        dict: contains the list of industries and the companies in each industry if successful,
        otherwise returns a message of the corresponding error if unsuccessful
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
            SELECT industry, perm_id
            FROM company
        """
        industries = []
        with db.cursor() as cur:
            cur.execute(query)

            for company in cur.fetchall():
                (industry, id) = company
                industry_companies = {
                    "type": industry,
                    "companies": []
                }
                if not any(i.get("type") == industry for i in industries):
                    industries.append(industry_companies)

                index = get_dictionary_index_in_list(industries, "type", industry)
                company_id = {
                    "company_id": id
                }
                industries[index]["companies"].append(company_id)

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

    Paramenters:
        company_id (int): the company's ID

    Returns:
        dict: 
    """
    db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")
    try:
        with db.cursor(dictionary=True) as cursor:
            # Fetch company details, ESG rating, industry, and industry ranking directly
            cursor.execute("""
                SELECT perm_id as company_id, name, info, esg_rating, industry, industry_ranking
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

    Parameters:
        token (JSON object): the user's token
        esg_data (dict): the ESG data for the currently selected company and framework

    Returns:
        dict: the ESG score of the company if successful, otherwise returns a message 
        with the corresponding error message if unsuccessful
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
    if not check_total_framework_metric_weight(esg_data):
        return {
            "status": "fail",
            "message": "Please make sure the weights of all framework metrics add up to 1",
            "code": BAD_REQUEST
        }
    if not check_total_indicator_weight(esg_data)[0]:
        framework_metrics_to_check = ", ".join(check_total_indicator_weight(esg_data)[1])
        return {
            "status": "fail",
            "message": f"Please make sure the weights of all indicators under each framework metric add up to 1. Please check indicator weights for: {framework_metrics_to_check}",
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

    esg_score = round(sum(averaged_weighted_scores), DECIMAL_PLACES)

    return {
        "esg_score": esg_score
    }

def check_total_framework_metric_weight(esg_data):
    """
    Checks if total weight of framework metrics is between (1 - 0.05) and (1 + 0.05) inclusive.
    """
    framework_metric_weights = [metric["framework_metric_weight"] for metric in esg_data]
    total_framework_metric_weight = sum(framework_metric_weights)
    if abs(total_framework_metric_weight - TOTAL_WEIGHT) > (0.05 * TOTAL_WEIGHT):
        return False
    
    return True
    
def check_total_indicator_weight(esg_data):
    """
    Checks if total weight of the indicators under each framework metric is 
    between (1 - 0.05) and (1 + 0.05) inclusive.
    Returns which framework metrics do not have the weights of the indicators under the metric
    adding up to 1.
    """
    framework_metrics_to_check = []
    for framework_metric in esg_data:
        indicator_weights = [indicator["indicator_weight"] for indicator in framework_metric["indicators"]]
        total_indicator_weight = sum(indicator_weights)
        if abs(total_indicator_weight - TOTAL_WEIGHT) > (0.05 * TOTAL_WEIGHT):
            framework_metrics_to_check.append(framework_metric["framework_metric_name"])
    if len(framework_metrics_to_check) > 0:
        return (False, framework_metrics_to_check)
    
    return (True, framework_metrics_to_check)
            