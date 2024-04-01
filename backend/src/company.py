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
