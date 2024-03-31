import mysql.connector

def get_company_details(company_id):
    # Fetches details of a specific company, including its ESG score and ranking within its industry.
    db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")
    try:
        with db.cursor(dictionary=True) as cursor:
            # Fetch company details and ESG score
            cursor.execute("""
                SELECT c.name, c.general_info, c.esg_score, i.name as industry
                FROM company c
                JOIN industry i ON c.industry_id = i.id
                WHERE c.id = %s
            """, (company_id,))
            company_details = cursor.fetchone()

            if company_details:
                # Calculate ESG ranking within its industry
                cursor.execute("""
                    SELECT COUNT(*) + 1 AS rank
                    FROM company
                    WHERE esg_score > %s AND industry_id = %s
                """, (company_details['esg_score'], company_details['industry_id']))
                rank = cursor.fetchone()
                company_details['esg_rank'] = rank['rank']
                return company_details
            else:
                return {"message": "Company not found."}
    finally:
        db.close()
