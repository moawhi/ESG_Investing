# Backend
This directory contains the code for the backend of the software.

## Requirements
- Python 3.9.x or later: To download, follow the guide for your system [here](https://www.python.org/downloads/)
- pip: No action required as this should be downloaded when Python is installed

Please ensure you have all necessary dependencies by executing the following command in the backend/ directory:
```
pip3 install -r requirements.txt
```

## Structure
- `src/` directory: This directory contains the code and logic for the backend functionalities and the server file.
    - `__init__.py`: To mark the `src/` directory as a package
    - `auth.py`: Contains functions for authentication and account management
    - `company.py`: Contains functions for information related to companies
    - `encryption.py`: Contains functions for password encryption and JWT encoding and decoding
    - `framework.py`: Contains functions related to frameworks
    - `helper.py`: Contains helper functions
    - `portfolio.py`: Contains functions related to portfolio management
    - `server.py`: Contains routes for the server and is used to run the server
    - `user.py`: Contains functions related to user details
- `tests/` directory: This directory contains tests to check the server and routes work as desired.
    - `__init__.py`: To mark the `tests/` directory as a package
    - `auth_test.py`: Tests for routes for authentication and account management
    - `clear.py`: Contains functions to clear the database for testing purposes
    - `company_test.py`: Tests for company routes
    - `framework_test.py`: Tests for framework routes
    - `portfolio_test.py`: Tests for portfolio routes
    - `user_test.py`: Tests for user routes

## Running Tests
Ensure you have pytest installed. If not, please execute `pip3 install -r requirements.txt` in the backend/ directory.

To run the tests, in the root directory, execute:
```
python3 -m pytest backend/
```
