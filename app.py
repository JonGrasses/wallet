from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/db'
mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    

    # Perform login logic (validate credentials, etc.)

    return 'Login successful'  # Replace with actual response

@app.route('/signup', methods=['POST'])
def signup():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')

    if not name or not email or not password or not confirm_password:
        return jsonify({'error': 'All fields are required'}), 400
    # Check if the username already exists in the database
    if username_exists(name):
        return jsonify({'error': 'Username already exists'}), 409

    # Continue with the signup logic if the username is not taken
    users_collection = mongo.db.users
    users_collection.insert_one({
        'name': name,
        'email': email,
        'password': password
    })

    return 'Signup successful'

def username_exists(username):
    users_collection = mongo.db.users
    existing_user = users_collection.find_one({'name': username})
    return existing_user is not None

if __name__ == '__main__':
    app.run(debug=True)
    