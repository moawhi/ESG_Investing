"""
Authentiation functions

"""

def auth_register(first_name, last_name, email, password):
    """
    User creates a new account with their first name, last name, email and password
    If email is already registered, no new account is created

    """
    pass

def auth_login(email, password):
    """
    User logs in to account using email and password
    """
    pass

def auth_logout():
    """
    User logs out of account
    """
    pass

def auth_block_account(email, password):
    """
    User is blocked from their account after multiple failed login attempts. An
    incorrect email or password causes a failed login attempt. The user's account
    is blocked until the user recovers it.
    """
    pass

def auth_check_password_strength(password):
    """
    Checks that the strength of the password is strong enough.
    A password should have:
    - at least 1 upper case letter
    - at least 1 lower case letter
    - at least 1 number
    - at least 1 special character
    - at least 8 characters
    """
    pass

def auth_check_registered_email(email):
    """
    Checks that the email has not been used to register already
    """
    pass