import sqlite3
import json
from datetime import datetime

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect('policy_checker.db')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_data JSON NOT NULL,
            upload_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS policies (
            id TEXT NOT NULL PRIMARY KEY,
            policy_json JSON NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS compliance_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            policy_id INTEGER,
            is_compliant BOOLEAN,
            details JSON,
            checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(policy_id) REFERENCES policies(id)
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('policy_checker.db')
    conn.row_factory = sqlite3.Row 
    return conn
