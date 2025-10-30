import json
from pathlib import Path
from queue import Empty
from types import NoneType
from database import get_db_connection
def load_users(users_json):
    print("\33[92mLoading users...\33[0m")
    conn = get_db_connection()
    for user in users_json:
        conn.execute(
            'INSERT OR REPLACE INTO users (id, user_data) VALUES (?, ?)',
            (user['id'], json.dumps(user))
        )
    conn.commit()
    conn.close()
    
def user_exist():
    conn = get_db_connection()
    users = conn.execute("SELECT * FROM users").fetchall()
    if users is None or not users:
        raise ValueError("None Users")