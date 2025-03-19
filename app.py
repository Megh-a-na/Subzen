from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    if len(data['username']) < 3:
        return jsonify({"error": "Username must be at least 3 characters long"}), 400

    if len(data['password']) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', data['password']):
        return jsonify({"error": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"}), 400

    if re.match(r'[a-zA-Z0-9_]+', data['username']) is None:
        return jsonify({"error": "Username must contain only letters, numbers and underscores"}), 400

    if data['password'] != data['confirmPassword']:
        return jsonify({"error": "Passwords do not match"}), 400
    
    # Print the received data
    print("\nReceived signup data:")
    print("Username:", data['username'])
    print("Email:", data['email'])
    print("Password:", data['password'])
    print("Confirm Password:", data['confirmPassword'])
    print("-" * 50)
    
    return jsonify({"message": "Data received successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000) 