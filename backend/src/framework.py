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
            return {
                "frameworks": frameworks
            }

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()

def get_esg_data_for_company_and_framework(company_id, framework_id, additional_metrics=None):
    """
    Fetch ESG data for a specific company within a selected framework and optional additional metrics.
    The function now returns data including the year, framework metric weight, indicator weight,
    and ESG score of the indicator along with the source origin (provider name), leaving the calculation of the weighted score for later processing.
    Parameters:
        company_id (int): ID of the company.
        framework_id (int): ID of the framework.
        additional_metrics (list of int, optional): List of additional metric IDs to include.
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

            # Fetching ESG data for the framework
            cursor.execute("""
                SELECT fm.name AS framework_metric_name, fm.description AS framework_metric_description, fm.weight AS framework_metric_weight,
                    ind.name AS indicator_name, ind.description AS indicator_description,
                    ced.metric_score, ced.metric_year, fmi.weight AS indicator_weight, ced.provider_name
                FROM framework_metric fm
                JOIN framework_metric_indicator_mapping fmi ON fm.id = fmi.framework_metric_id
                JOIN indicator ind ON fmi.indicator_id = ind.id
                JOIN company_esg_raw_data ced ON ind.id = ced.metric_id
                WHERE fm.framework_id = %s AND ced.company_id = %s
            """, (framework_id, company_id))

            process_esg_data(cursor, esg_data)

            # Fetch additional metrics if provided
            if additional_metrics:
                for metric_id in additional_metrics:
                    cursor.execute("""
                        SELECT fm.name AS framework_metric_name, fm.description AS framework_metric_description, 0 AS framework_metric_weight,
                            ced.metric_name AS indicator_name, ced.metric_score, ced.metric_year, ind.description AS indicator_description,
                            0 AS indicator_weight, ced.provider_name
                        FROM framework_metric fm
                        JOIN framework_metric_indicator_mapping fmi ON fm.id = fmi.framework_metric_id
                        JOIN indicator ind ON fmi.indicator_id = ind.id
                        JOIN company_esg_raw_data ced ON ind.id = ced.metric_id AND ced.company_id = %s
                        WHERE fm.id = %s
                    """, (company_id, metric_id))
                    process_esg_data(cursor, esg_data)

            if not esg_data:
                return {"status": "fail", "message": "No ESG data found for the specified company and framework."}

    finally:
        db.close()

    return {"esg_data": esg_data}

def process_esg_data(cursor, esg_data):
    for row in cursor.fetchall():
        existing_metric = next((item for item in esg_data if item["framework_metric_name"] == row["framework_metric_name"]), None)
        if not existing_metric:
            existing_metric = {
                "framework_metric_name": row["framework_metric_name"],
                "framework_metric_description": row.get("framework_metric_description", ""),  # Include framework metric description
                "framework_metric_weight": row.get("framework_metric_weight", 0),
                "indicators": []
            }
            esg_data.append(existing_metric)

        indicator_details = {
            "indicator_name": row["indicator_name"],
            "indicator_description": row["indicator_description"],
            "indicator_weight": row.get("indicator_weight", 1),
            "indicator_score_{}".format(row["metric_year"]): row["metric_score"],
            "provider_name": row["provider_name"]
        }
        indicator = next((i for i in existing_metric["indicators"] if i["indicator_name"] == row["indicator_name"]), None)
        if indicator is None:
            existing_metric["indicators"].append(indicator_details)
        else:
            indicator.update(indicator_details)

def list_metrics_not_part_of_framework(framework_id):
    """
    Fetch all metrics and their indicators that are not part of the specified framework.
    """
    db = None
    try:
        db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")
        query = """
            SELECT fm.id AS metric_id, fm.name AS metric_name, fm.description AS metric_description,
                   ind.id AS indicator_id, ind.name AS indicator_name, ind.description AS indicator_description
            FROM framework_metric fm
            INNER JOIN framework_metric_indicator_mapping fmi ON fm.id = fmi.framework_metric_id
            INNER JOIN indicator ind ON fmi.indicator_id = ind.id
            WHERE fm.id NOT IN (
                SELECT id FROM framework_metric WHERE framework_id = %s
            )
        """
        with db.cursor(dictionary=True) as cursor:
            cursor.execute(query, (framework_id,))
            metrics = {}
            for row in cursor.fetchall():
                if row['metric_id'] not in metrics:
                    metrics[row['metric_id']] = {
                        'metric_name': row['metric_name'],
                        'metric_description': row['metric_description'],
                        'indicators': []
                    }
                metrics[row['metric_id']]['indicators'].append({
                    'indicator_id': row['indicator_id'],
                    'indicator_name': row['indicator_name'],
                    'indicator_description': row['indicator_description']
                })
            return {'metrics': list(metrics.values())}

    except Exception as err:
        print(f"Error: {err}")
        return {"status": "fail", "message": "Unable to fetch metrics", "code": FORBIDDEN}

    finally:
        if db and db.is_connected():
            db.close()