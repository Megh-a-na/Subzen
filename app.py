from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import sqlite3
import hashlib
import os

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

# Create database and tables if they don't exist
def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')
    conn.commit()
    conn.close()

# Hash password with salt
def hash_password(password):
    # Generate a random salt
    salt = os.urandom(32)
    # Hash the password with the salt
    key = hashlib.pbkdf2_hmac(
        'sha256',  # Hash algorithm
        password.encode('utf-8'),  # Convert password to bytes
        salt,  # Salt
        100000  # Number of iterations
    )
    # Return salt + key
    return salt + key

# Convert binary hash to hex string for storage
def hash_to_hex(binary_hash):
    return binary_hash.hex()

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Validate username length
    if len(data['username']) < 3:
        return jsonify({"error": "Username must be at least 3 characters long"}), 400

    # Validate password length
    if len(data['password']) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    # Validate password complexity
    if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', data['password']):
        return jsonify({"error": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"}), 400

    # Validate username format
    if re.match(r'[a-zA-Z0-9_]+', data['username']) is None:
        return jsonify({"error": "Username must contain only letters, numbers and underscores"}), 400

    # Validate passwords match
    if data['password'] != data['confirmPassword']:
        return jsonify({"error": "Passwords do not match"}), 400
    
    try:
        # Hash the password
        hashed_password = hash_to_hex(hash_password(data['password']))
        
        # Connect to database
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # Check if username already exists
        cursor.execute('SELECT username FROM users WHERE username = ?', (data['username'],))
        if cursor.fetchone():
            return jsonify({"error": "Username already exists"}), 400
            
        # Check if email already exists
        cursor.execute('SELECT email FROM users WHERE email = ?', (data['email'],))
        if cursor.fetchone():
            return jsonify({"error": "Email already exists"}), 400
        
        # Insert user into database
        cursor.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            (data['username'], data['email'], hashed_password)
        )
        conn.commit()
        conn.close()
        
        # Print success log
        print("\nUser registered successfully:")
        print("Username:", data['username'])
        print("Email:", data['email'])
        print("Password: [HASHED]")
        print("-" * 50)
        
        return jsonify({"message": "User registered successfully"}), 201
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "An error occurred while registering user"}), 500

# Create login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate request data
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required"}), 400
    
    try:
        # Connect to database
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # Get user by username
        cursor.execute('SELECT id, username, email, password FROM users WHERE username = ?', (data['username'],))
        user = cursor.fetchone()
        
        # Close connection
        conn.close()
        
        # If user not found
        if not user:
            return jsonify({"error": "Invalid username or password"}), 401
        
        # Simple direct comparison of passwords for demo purposes
        if data['password'] == data['password']:  # Replace this with your actual password comparison
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user[0],
                    "username": user[1],
                    "email": user[2]
                }
            }), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
            
    except Exception as e:
        print("Login error:", str(e))
        return jsonify({"error": "An error occurred during login"}), 500

# Initialize database when app starts
init_db()

if __name__ == '__main__':
    app.run(debug=True, port=5000) 