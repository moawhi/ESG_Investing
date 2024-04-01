"""
Framework functions
"""

import mysql.connector
from backend.src.helper import verify_token

FORBIDDEN = 403

def framework_list(token):
    """
    Gets all available frameworks in the database.
    Provides the name and the information of each framework.
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
            SELECT name, info
            FROM framework
        """
        frameworks = []
        with db.cursor() as cur:
            cur.execute(query)

            for framework in cur.fetchall():
                (name, info) = framework
                framework_details = {
                    "name": name,
                    "info": info
                }
                frameworks.append(framework_details)

            return {
                "frameworks": frameworks
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def framework_default_metrics(token, framework):
    """
    Gets the default metrics for a selected framework
    """

def get_esg_data_for_company_and_framework(company_id, framework_id):
    """
    Fetch ESG data for a specific company within a selected framework.
    Aggregate the data based on the framework's metric weights.
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

            cursor.execute("""
                SELECT fm.name AS framework_metric_name, fm.description, fm.weight AS framework_metric_weight,
                       ced.metric_name, ced.metric_score, ind.description AS indicator_description,
                       fmi.weight AS indicator_weight
                FROM framework_metric fm
                JOIN framework_metric_indicator_mapping fmi ON fm.id = fmi.framework_metric_id
                JOIN indicator ind ON fmi.indicator_id = ind.id
                JOIN company_esg_raw_data ced ON ind.id = ced.metric_id AND ced.company_id = %s
                WHERE fm.framework_id = %s
            """, (company_id, framework_id))
            
            for row in cursor.fetchall():
                # Adjust calculation based on actual data relationships and available columns
                # Example calculation, adjust as necessary
                weighted_score = row['metric_score'] * row['framework_metric_weight'] * row.get('indicator_weight', 1)
                esg_data.append({
                    "framework_metric_name": row['framework_metric_name'],
                    "indicator_description": row['indicator_description'],
                    "metric_name": row['metric_name'],
                    "weighted_score": weighted_score
                })

            if not esg_data:
                return {"status": "fail", "message": "No ESG data found for the specified company and framework."}

    finally:
        db.close()

    return {"esg_data": esg_data}

