import json
from database import get_db_connection

def checker():
    conn = get_db_connection()
    user_json = conn.execute("SELECT user_data FROM users")
    policies_json = conn.execute("SELECT policy_json FROM policies")
    users = user_json.fetchall()
    policies = policies_json.fetchall()

    results = []

    for user in users:
        user_data = json.loads(user["user_data"])
        user_result = {"username": user_data.get("username", "Unknown"), "policies": []}
        for policy in policies:
            rule = json.loads(policy["policy_json"])
            expression = f"user['{rule['field']}'] {rule['operator']} {rule['value']}"

            try:
                code_obj = compile(expression, '<policy_rule>', 'eval')
                check = eval(code_obj, {}, {"user": user_data})
            except Exception:
                check = False

            user_result["policies"].append({
                "policy_name": rule.get("field", "Unnamed Policy"),
                "result": check
            })

        results.append(user_result)

    conn.close()
    return results
