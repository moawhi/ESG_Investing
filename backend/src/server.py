"""
Server
"""

from backend.src import auth, framework, company, portfolio
from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.src.company import get_company_details
from backend.src.helper import verify_token
import json

app = Flask(__name__)
CORS(app)
HOST = "127.0.0.1"
PORT = 12345

@app.route("/register", methods=["POST"])
def register():
    info = request.get_json()
    first_name = info["first_name"]
    last_name = info["last_name"]
    email = info["email_address"]
    password = info["password"]

    response = auth.auth_register(first_name, last_name, email, password)
    if response["status"] == "fail":
        return jsonify(response), 400
    return jsonify(response), 200

@app.route("/login", methods=["POST"])
def login():
    info = request.get_json()
    email = info["email_address"]
    password = info["password"]
    login_response = auth.auth_login(email, password)

    if login_response.get("code"):
        return jsonify(login_response), login_response.get("code")
    return jsonify(login_response)

@app.route("/logout", methods=["POST"])
def logout():
    info = request.get_json()
    token = info["token"]
    logout_response = auth.auth_logout(token)
    
    if logout_response.get("code"):
        return jsonify(logout_response), logout_response.get("code")
    return jsonify(logout_response)

@app.route("/framework/list", methods=["GET"])
def framework_list():
    header = request.headers.get("Authorisation")
    token = ""
    if header and header.startswith("Bearer "):
        token = header.split(" ")[1]
    company_id = request.args.get("company_id")

    response = framework.framework_list(token, company_id)
    if response.get("code"):
        return jsonify(response), response.get("code")
    return jsonify(response)

@app.route("/company/industry-company-list", methods=["GET"])
def industry_company_list():
    header = request.headers.get('Authorisation')
    token = ''
    if header and header.startswith('Bearer '):
        token = header.split(' ')[1]

    response = company.company_industry_company_list(token)
    if response.get("code"):
        return jsonify(response), response.get("code")
    return jsonify(response)

@app.route("/company/<int:company_id>", methods=["GET"])
def company_details(company_id):
    """
    Endpoint to retrieve details of a specific company.
    """
    header = request.headers.get('Authorisation')
    token = ""
    if header and header.startswith("Bearer "):
        token = header.split(" ")[1]
    
    if not verify_token(token):
        return jsonify({"status": "fail", "message": "Invalid token"}), 403

    details = get_company_details(company_id)
    if "message" in details:
        return jsonify(details), 404
    return jsonify(details), 200

@app.route("/company/esg", methods=["GET"])
def company_esg():
    header = request.headers.get("Authorisation")
    token = ""
    if header and header.startswith("Bearer "):
        token = header.split(" ")[1]

    if not verify_token(token):
        return jsonify({"status": "fail", "message": "Invalid token"}), 403

    company_id = request.args.get("company_id", type=int)
    framework_id = request.args.get("framework_id", type=int)
    additional_metrics = request.args.get("additional_metrics")  # JSON string of metric IDs

    if not company_id or not framework_id:
        return jsonify({"status": "fail", "message": "Missing company or framework ID"}), 400

    if additional_metrics:
        try:
            additional_metrics = json.loads(additional_metrics)
        except json.JSONDecodeError:
            return jsonify({"status": "fail", "message": "Invalid additional metrics format"}), 400

    esg_data = framework.get_esg_data_for_company_and_framework(company_id, framework_id, additional_metrics)
    if "message" in esg_data:
        return jsonify(esg_data), 404

    return jsonify(esg_data), 200

@app.route("/company/calculate-esg-score", methods=["POST"])
def calculate_esg_score():
    header = request.headers.get("Authorisation")
    token = ""
    if header and header.startswith("Bearer "):
        token = header.split(" ")[1]
    info = request.get_json()
    esg_data = info["esg_data"]

    response = company.company_calculate_esg_score(token, esg_data)
    if response.get("code"):
        return jsonify(response), response.get("code")
    return jsonify(response)

@app.route("/framework/<int:framework_id>/unincluded-metrics", methods=["GET"])
def unincluded_metrics(framework_id):
    """
    Endpoint to retrieve all metrics and their indicators that are not part of a specified framework.
    """
    metrics = framework.list_metrics_not_part_of_framework(framework_id)
    if "metrics" in metrics:
        return jsonify(metrics), 200
    else:
        return jsonify(metrics), 400

@app.route("/portfolio/save-company", methods=["POST"])
def save_company_to_portfolio():
    header = request.headers.get("Authorisation")
    token = ""
    if header and header.startswith("Bearer "):
        token = header.split(" ")[1]
    info = request.get_json()
    company_id = info["company_id"]
    investment_amount = info["investment_amount"]
    comment = info["comment"]

    response = portfolio.portfolio_save_company(token, company_id, investment_amount, comment)
    if response.get("code"):
        return jsonify(response), response.get("code")
    return jsonify(response)

@app.route("/portfolio/delete-company", methods=["DELETE"])
def delete_company_from_portfolio():
    header = request.headers.get("Authorisation")
    token = ""
    if header and header.startswith("Bearer "):
        token = header.split(" ")[1]
    info = request.get_json()
    company_id = info["company_id"]

    response = portfolio.portfolio_delete_company(token, company_id)
    if response.get("code"):
        return jsonify(response), response.get("code")
    return jsonify(response)

@app.route("/portfolio/list", methods=["GET"])
def get_portfolio_companies_details():
    header = request.headers.get("Authorisation")
    token = ""
    if header and header.startswith("Bearer "):
        token = header.split(" ")[1]
    
    response = portfolio.portfolio_list(token)
    if response.get("code"):
        return jsonify(response), response.get("code")
    return jsonify(response)

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)