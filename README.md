# AuditOne

AuditOne is a full‑stack app for uploading policy rules and user data, then evaluating and visualizing compliance.

## Overview

- Backend: FastAPI + SQLite (persistent storage)
- Frontend: React (Vite) single‑page app
- Data: JSON uploads for policies and users
- Results: Per‑user pass/fail per policy

## Repository Structure

```
AuditOne/
├── BackEnd/
│   ├── app/main.py            # FastAPI app + routes
│   ├── database.py            # SQLite init/connection helpers
│   ├── services/
│   │   ├── policy_evaluator.py# Compliance evaluation logic
│   │   ├── policy_loader.py   # Policies CRUD helpers
│   │   └── user_loader.py     # Users CRUD helpers
│   ├── requirements.txt       # Python deps
│   └── policy_checker.db      # SQLite DB (generated)
|
├── FrontEnd/
│   ├── src/                   # React app
│   │   └── components/        # Uploaders, results, success page
│   ├── package.json
│   └── vite.config.js
|
├── Data/
│   ├── policy.json            # Example policies
│   └── user.json              # Example users
|
├── docs/
│   └── image.png              # Screenshot/diagram (optional)
└── README.md
```

## Quick Start

### 1) Backend

Requirements: Python 3.10+

```bash
cd BackEnd
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`.

### 2) Frontend

Requirements: Node.js 18+

```bash
cd FrontEnd
npm install
npm run dev
```

The app runs at `http://localhost:5173` and talks to the backend at `http://127.0.0.1:8000`.

## Using the App

1) Open the frontend in the browser.
2) Upload policies (`Data/policy.json`) using the Policy Uploader.
3) After success, you can edit a policy in the UI and save.
4) Upload users (`Data/user.json`) using the User Uploader.
5) View results: each user shows badges for each policy (✅/❌).

You can also try via curl:

```bash
# Upload policies
curl -X POST -F "file=@Data/policy.json" http://127.0.0.1:8000/policies

# Upload users
curl -X POST -F "file=@Data/user.json" http://127.0.0.1:8000/users

# Get results
curl http://127.0.0.1:8000/results | jq
```

## API Endpoints

- GET `/` → health message
- GET `/ping` → `{ message: "pong" }`
- GET `/policies` → list of policies: `[ { id, policy_json } ]`
- POST `/policies` (multipart) → upload policies file (JSON array)
- PUT `/policies` (JSON) → update or upsert policies, body: `[ { id, policy_json } ]`
- POST `/users` (multipart) → upload users file (JSON array)
- GET `/results` → per‑user evaluation results
- GET `/check-users` → verifies users exist (used by UI flow)

## Data Formats

Example policy record (in the uploaded array):

```json
{ "id": "password_min_length", "rule": { "field": "password_length", "operator": ">=", "value": 8 } }
```

When stored, the backend keeps `{ field, operator, value }` under `policy_json` by `id`.

Example user record (in the uploaded array):

```json
{ "id": "1", "username": "admin", "password_length": 14, "mfa_enabled": true }
```

## How Evaluation Works

- For each user and policy, the backend evaluates the expression: `user[field] operator value`.
- Results are returned as:

```json
{
  "username": "admin",
  "policies": [
    { "policy_name": "password_length", "result": true }
  ]
}
```

Note: Only simple comparisons are supported. Ensure user fields and policy `value` types match.

## Development Notes

- DB is initialized on startup (`database.py`). If you delete `policy_checker.db`, it will be recreated.
- CORS is open for local development.
- Frontend routes/components of interest:
  - `components/PolicyUploader.jsx`
  - `components/UserUploader.jsx`
  - `components/SuccessPage.jsx` (policy editing)
  - `components/resulte.jsx` and `components/ResultsList.css` (results view)

## Security Considerations

- Evaluation currently uses dynamic expression evaluation for simplicity. Do not expose this as-is to untrusted inputs in production. Consider a safe, typed rule engine or hard‑coded operator mapping.

## License

MIT
