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