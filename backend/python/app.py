from flask import Flask, request, jsonify
from flask_mail import Mail, Message
import random
import os
from dotenv import load_dotenv

# Load environment variables from python.env file
load_dotenv('python.env')

app = Flask(__name__)

# Get environment variables with default values
mail_server = os.getenv('MAIL_SERVER', 'smtp.example.com')
mail_port = os.getenv('MAIL_PORT', '587')  # Default port if not set
mail_username = os.getenv('MAIL_USERNAME', 'aadavanrock@gmail.com')
mail_password = os.getenv('MAIL_PASSWORD')
mail_use_tls = os.getenv('MAIL_USE_TLS', 'True') == 'True'
mail_use_ssl = os.getenv('MAIL_USE_SSL', 'False') == 'True'

# Validate and convert MAIL_PORT to integer
try:
    app.config['MAIL_PORT'] = int(mail_port)
except ValueError:
    raise ValueError(f"MAIL_PORT must be an integer, but got {mail_port}")

# Flask-Mail configuration
app.config['MAIL_SERVER'] = mail_server
app.config['MAIL_PORT'] = app.config['MAIL_PORT']
app.config['MAIL_USERNAME'] = mail_username
app.config['MAIL_PASSWORD'] = mail_password
app.config['MAIL_USE_TLS'] = mail_use_tls
app.config['MAIL_USE_SSL'] = mail_use_ssl

mail = Mail(app)

# Function to generate a random OTP
def generate_otp():
    return str(random.randint(100000, 999999))

@app.route('/sendOtp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    otp = generate_otp()
    
    # Sending the OTP email
    msg = Message('Your OTP Code', sender=app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Your OTP code is {otp}'
    
    try:
        mail.send(msg)
        return jsonify({'message': 'OTP sent successfully', 'otp': otp})  # Return the OTP for storing
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
