import json
from pathlib import Path

from database import get_db_connection

def set_policies(policies_json):
    print("\33[92mLoading policies...\33[0m")
    conn = get_db_connection()
    for policy in policies_json:
        if policy['id'] is None \
            or policy['rule'] is None:
            continue
        conn.execute("INSERT INTO policies (id, policy_json) VALUES (?, ?)",(policy['id'], json.dumps(policy['rule'])))
    conn.commit()
    conn.close()

def update_policies(policies_json):
    print("\33[92mLoading policies...\33[0m")
    conn = get_db_connection()

    for policy in policies_json:
        id = policy['id']
        policy_json = json.loads(policy['policy_json'])
        if id is None \
            or policy_json is None:
            continue
        conn.execute("INSERT OR REPLACE INTO policies (id, policy_json) VALUES (?, ?)",(policy['id'], json.dumps(policy_json)))
    conn.commit()
    conn.close()



def get_policies():
    conn = get_db_connection()
    policies = conn.execute("SELECT id, policy_json FROM policies")
    policies_json = [{'id': policie['id'], 'policy_json': policie['policy_json']} for policie in policies.fetchall()]
    return policies_json