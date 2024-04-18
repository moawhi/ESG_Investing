"""
Clear functions
Filename: clear.py

For testing purposes only

Functions:
    clear_users
"""

import mysql.connector

def clear_users_and_portfolios():
    """
    Removes all users and portfolios in database.
    """
    db = None
    try:
        db = mysql.connector.connect(user="esg", password="esg", host="127.0.0.1", database="esg_management")

        delete_users = """
            DELETE FROM user
        """
        delete_portfolios = """
            DELETE FROM user_portfolio
        """
        with db.cursor() as cur:
            cur.execute(delete_users)
            db.commit()
            cur.execute(delete_portfolios)
            db.commit()

    except Exception as err:
        print(f"Error: {err}")

    finally:
        if db.is_connected():
            db.close()
