"""
Framework functions
"""

import mysql.connector
from backend.src.helper import verify_token

FORBIDDEN = 403

def framework_list(token, company):
    """
    Gets all available frameworks in the database for a specified company.
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
            SELECT f.name, f.info
            FROM framework f
                JOIN framework_company_mapping fcm on (fcm.framework_id = f.id)
                JOIN company c on (c.perm_id = fcm.company_id)
            WHERE c.name = %s
        """
        frameworks = []
        with db.cursor() as cur:
            cur.execute(query, [company])

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