from sqlalchemy import create_engine, text
import os
import logging

# Set the logging level (optional)
logging.basicConfig(level=logging.ERROR)
z = 0
i = 0
s = os.environ['db_connection']
engine = create_engine(s,
                       connect_args={"ssl": {
                         "ssl_ca": "/etc/ssl/cert.pem"
                       }},
                       pool_pre_ping=True)


def add_user(data):
  try:
    with engine.connect() as conn:
      query = text(
        "INSERT INTO authentication(username, email, password) VALUES (:username, :email, :password)"
      )
      conn.execute(
        query, {
          'username': data['username'],
          'email': data['email'],
          'password': data['password'],
        })
    return 1
  except Exception as e:
    print(e)
    return 0


def sign_in(data):
  with engine.connect() as conn:
    query = text(
      "SELECT * FROM authentication WHERE username= :username AND password= :password"
    ).bindparams(username=data['username'], password=data['password'])
    result = conn.execute(query)
    user_exists = result.fetchone()
    print(result.fetchone())
    if user_exists:
      return 1
    else:
      return 0
