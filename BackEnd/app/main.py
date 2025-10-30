from typing import Any
from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from services.user_loader import load_users, user_exist
from services.policy_loader import get_policies, set_policies, update_policies
from services.policy_evaluator import checker
from database import init_db
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()
    print("Database initialized ✅")

@app.get("/")
async def index():
    return JSONResponse({"message": "Hello, World!"})

@app.get("/ping")
async def ping():
    return JSONResponse({"message": "pong"})


@app.get("/policies")
async def policies():
    return JSONResponse(get_policies())




@app.post("/users")
async def users_post(file: UploadFile = File(...)):
    try:
        content = await file.read()
        json_str = content.decode("utf-8")
        users_json = json.loads(json_str)
        load_users(users_json)
        return JSONResponse({"message": f"{file.filename} uploaded successfully"})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)


@app.post("/policies")
async def policies_post(file: UploadFile = File(...)):
    try:
        content = await file.read()
        json_str = content.decode("utf-8")
        policies_json = json.loads(json_str)
        set_policies(policies_json)
        return JSONResponse({"message": f"{file.filename} uploaded successfully"})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

@app.put("/policies")
async def update_policies_endpoint(policies: Any = Body(...)):
    try:
        policies_json = policies
        update_policies(policies_json)
        return JSONResponse({"message": f"updated successfully"})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)



@app.get("/results")
async def get_results():
    data = checker()
    return JSONResponse(data)


@app.get("/check-users")
async def check_users():
    try:
        user_exist()
        return JSONResponse({"message": f"updated successfully"})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

