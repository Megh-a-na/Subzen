from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import sqlite3
import hashlib
import os
from datetime import datetime

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

# Add this after your existing imports
from datetime import datetime

# Add this after your init_db function
def init_subscriptions_table():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Create subscriptions table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        duration TEXT NOT NULL,
        cost REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Add subscriptions table to sqlite_sequence if it doesn't exist
    cursor.execute('''
    INSERT OR IGNORE INTO sqlite_sequence (name, seq)
    SELECT 'subscriptions', 0
    WHERE NOT EXISTS (
        SELECT 1 FROM sqlite_sequence WHERE name = 'subscriptions'
    )
    ''')
    
    # Print table creation status
    print("\nInitializing database tables:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print("Available tables:", [table[0] for table in tables])
    
    conn.commit()
    conn.close()

# Update the add_subscription route to include better logging
@app.route('/api/subscriptions/add', methods=['POST'])
def add_subscription():
    data = request.get_json()
    
    # Print received data for debugging
    print("\nReceived subscription data:", data)
    
    # Validate required fields
    required_fields = ['userId', 'name', 'category', 'duration', 'cost']
    if not all(field in data for field in required_fields):
        missing_fields = [field for field in required_fields if field not in data]
        print("Missing fields:", missing_fields)
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        # Convert cost to float and validate
        cost = float(data['cost'])
        if cost <= 0:
            return jsonify({"error": "Cost must be greater than 0"}), 400
            
        # Round to 2 decimal places
        cost = round(cost, 2)
            
        # Connect to database
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # Insert subscription
        cursor.execute('''
        INSERT INTO subscriptions (user_id, name, category, duration, cost)
        VALUES (?, ?, ?, ?, ?)
        ''', (data['userId'], data['name'], data['category'], data['duration'], cost))
        
        # Verify the insertion
        last_id = cursor.lastrowid
        cursor.execute('SELECT * FROM subscriptions WHERE id = ?', (last_id,))
        inserted_data = cursor.fetchone()
        
        # Print success log
        print("\nSubscription added successfully:")
        print("ID:", last_id)
        print("User ID:", data['userId'])
        print("Name:", data['name'])
        print("Category:", data['category'])
        print("Duration:", data['duration'])
        print("Cost:", cost)
        print("Inserted data:", inserted_data)
        print("-" * 50)
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Subscription added successfully",
            "subscriptionId": last_id
        }), 201
        
    except ValueError as ve:
        print("ValueError:", str(ve))
        return jsonify({"error": "Invalid cost value"}), 400
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "An error occurred while adding subscription"}), 500

# Add this function to remove duplicates
def remove_duplicate_subscriptions():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Delete duplicate rows keeping the one with the lowest ID
    cursor.execute('''
    DELETE FROM subscriptions 
    WHERE id NOT IN (
        SELECT MIN(id)
        FROM subscriptions
        GROUP BY user_id, name, category, duration, cost
    )
    ''')
    
    # Commit the changes
    conn.commit()
    
    # Print the remaining records
    print("\nRemaining subscriptions after removing duplicates:")
    cursor.execute('SELECT * FROM subscriptions')
    for row in cursor.fetchall():
        print(row)
    
    conn.close()

# Move this route definition before the if __name__ == '__main__': block
@app.route('/api/subscriptions/get/<int:user_id>', methods=['GET'])
def get_subscriptions(user_id):
    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # First check if user exists
        cursor.execute('SELECT id FROM users WHERE id = ?', (user_id,))
        if not cursor.fetchone():
            return jsonify({"error": "User not found"}), 404
        
        # Fetch all subscriptions for the user
        cursor.execute('''
        SELECT id, name, category, duration, cost, created_at 
        FROM subscriptions 
        WHERE user_id = ?
        ORDER BY created_at DESC
        ''', (user_id,))
        
        subscriptions = cursor.fetchall()
        
        # Convert to list of dictionaries
        subscription_list = []
        for sub in subscriptions:
            subscription_list.append({
                'id': sub[0],
                'name': sub[1],
                'category': sub[2],
                'duration': sub[3],
                'cost': sub[4],
                'created_at': sub[5]
            })
        
        # Debug print
        print(f"Fetched {len(subscription_list)} subscriptions for user {user_id}")
        print("Subscriptions:", subscription_list)
        
        conn.close()
        return jsonify(subscription_list), 200
        
    except Exception as e:
        print("Error fetching subscriptions:", str(e))
        return jsonify({"error": "Failed to fetch subscriptions"}), 500

# Keep the HTML display route separate
@app.route('/subscriptions/view/<int:user_id>')
def view_subscriptions(user_id):
    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # Fetch user details
        cursor.execute('SELECT username FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return "User not found", 404
        
        # Fetch all subscriptions for the user
        cursor.execute('''
        SELECT name, category, duration, cost, created_at 
        FROM subscriptions 
        WHERE user_id = ?
        ORDER BY created_at DESC
        ''', (user_id,))
        
        subscriptions = cursor.fetchall()
        conn.close()
        
        # Create HTML response
        html = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Subscriptions</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }}
                h1 {{
                    color: #000000;
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .subscriptions-grid {{
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }}
                .subscription-card {{
                    background-color: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }}
                .subscription-header {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }}
                .category-badge {{
                    background-color: #ff6b6b;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                }}
                .subscription-details p {{
                    margin: 8px 0;
                    color: #666;
                }}
                .no-subscriptions {{
                    text-align: center;
                    padding: 40px;
                    background-color: white;
                    border-radius: 12px;
                    margin: 20px;
                }}
            </style>
        </head>
        <body>
            <h1>My Subscriptions</h1>
            <div class="subscriptions-grid">
        '''
        
        if not subscriptions:
            html += '''
                <div class="no-subscriptions">
                    <p>You haven't added any subscriptions yet.</p>
                </div>
            '''
        else:
            for sub in subscriptions:
                html += f'''
                <div class="subscription-card">
                    <div class="subscription-header">
                        <h3>{sub[0]}</h3>
                        <span class="category-badge">{sub[1]}</span>
                    </div>
                    <div class="subscription-details">
                        <p><strong>Duration:</strong> {sub[2]}</p>
                        <p><strong>Cost:</strong> ₹{sub[3]}</p>
                        <p><strong>Added on:</strong> {sub[4]}</p>
                    </div>
                </div>
                '''
        
        html += '''
            </div>
        </body>
        </html>
        '''
        
        return html
        
    except Exception as e:
        print("Error displaying subscriptions:", str(e))
        return "Error displaying subscriptions", 500

# Keep this at the end of the file
if __name__ == '__main__':
    init_db()
    init_subscriptions_table()
    remove_duplicate_subscriptions()
    app.run(debug=True, port=5000) 