"""
Framework functions
"""

import mysql.connector
from backend.src.helper import verify_token

FORBIDDEN = 403

def framework_list(token, company_id):
    """
    Gets all available frameworks in the database for a specified company using
    the company id.
    Provides the id, name and the information of each framework.
    """
    if not verify_token(token):
        return {
            "status": "fail",
            "message": "Invalid token",
            "code": FORBIDDEN
        }
    print(company_id)
    db = None
    try:
        db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")
        
        query = """
            SELECT f.id, f.name, f.info
            FROM framework f
                JOIN framework_company_mapping fcm ON (fcm.framework_id = f.id)
                JOIN company c ON (c.perm_id = fcm.company_id)
            WHERE c.perm_id = %s
        """
        frameworks = []
        with db.cursor() as cur:
            cur.execute(query, [company_id])

            for framework in cur.fetchall():
                (id, name, info) = framework
                framework_details = {
                    "framework_id": id,
                    "name": name,
                    "info": info
                }
                frameworks.append(framework_details)
            print(frameworks)
            return {
                "frameworks": frameworks
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def get_esg_data_for_company_and_framework(company_id, framework_id):
    """
    Fetch ESG data for a specific company within a selected framework.
    The function now returns data including the year, framework metric weight, indicator weight,
    and ESG score of the indicator, leaving the calculation of the weighted score for later processing.
    """
    db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")
    esg_data = []
    try:
        with db.cursor(dictionary=True) as cursor:
            # Verify the company is mapped to the framework
            cursor.execute("""
                SELECT * FROM framework_company_mapping
                WHERE company_id = %s AND framework_id = %s
            """, (company_id, framework_id))
            if cursor.fetchone() is None:
                return {"status": "fail", "message": "Company is not mapped to the requested framework."}

            # Fetching ESG data with year, framework metric weight, indicator weight, and ESG score
            cursor.execute("""
                SELECT fm.name AS framework_metric_name, fm.description, fm.weight AS framework_metric_weight,
                       ced.metric_name, ced.metric_score, ced.metric_year, ind.description AS indicator_description,
                       fmi.weight AS indicator_weight
                FROM framework_metric fm
                JOIN framework_metric_indicator_mapping fmi ON fm.id = fmi.framework_metric_id
                JOIN indicator ind ON fmi.indicator_id = ind.id
                JOIN company_esg_raw_data ced ON ind.id = ced.metric_id AND ced.company_id = %s
                WHERE fm.framework_id = %s
            """, (company_id, framework_id))
            
            for row in cursor.fetchall():
                esg_data.append({
                    "framework_metric_name": row['framework_metric_name'],
                    "framework_metric_weight": row['framework_metric_weight'],
                    "indicator_description": row['indicator_description'],
                    "metric_name": row['metric_name'],
                    "metric_year": row['metric_year'],
                    "indicator_weight": row['indicator_weight'],
                    "metric_score": row['metric_score']  # This is the ESG score of the indicator
                })

            if not esg_data:
                return {"status": "fail", "message": "No ESG data found for the specified company and framework."}

    finally:
        db.close()

    return {"esg_data": esg_data}
