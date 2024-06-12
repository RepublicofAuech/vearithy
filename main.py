import json
import os
import requests
from flask import Flask, jsonify, send_from_directory, redirect, request, url_for
from urllib.parse import urlencode

app = Flask(__name__, static_folder='static')
app.secret_key = os.urandom(24)

# Discord OAuth2 Configuration
CLIENT_ID = '1245921092879650917'
CLIENT_SECRET = 'HXHx7RHbQpAqt0jNZHMc_0baTjACeRNY'
REDIRECT_URI = 'https://republicofauech.github.io/vearithy/'
API_BASE_URL = 'https://discord.com/api/v10'
AUTHORIZATION_BASE_URL = 'https://discord.com/api/oauth2/authorize'
TOKEN_URL = 'https://discord.com/api/oauth2/token'

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/login')
def login():
    params = {
        'client_id': CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'response_type': 'code',
        'scope': 'identify guilds',
    }
    return redirect(f"{AUTHORIZATION_BASE_URL}?{urlencode(params)}")

@app.route('/callback')
def callback():
    code = request.args.get('code')
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'scope': 'identify guilds',
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post(TOKEN_URL, data=data, headers=headers)
    response_data = response.json()
    access_token = response_data.get('access_token')

    user_info = get_user_info(access_token)
    save_user_info(user_info)
    return redirect(url_for('index'))

def get_user_info(access_token):
    url = f"{API_BASE_URL}/users/@me"
    headers = {
        'Authorization': f"Bearer {access_token}"
    }
    user_response = requests.get(url, headers=headers)
    return user_response.json()

def save_user_info(user_info):
    with open('static/user_info.json', 'w') as f:
        json.dump(user_info, f)

@app.route('/user_info.json')
def user_info():
    if os.path.exists('static/user_info.json'):
        with open('static/user_info.json', 'r') as f:
            data = json.load(f)
        return jsonify(data)
    else:
        return jsonify({"error": "User not authenticated"})

if __name__ == "__main__":
    app.run(port=5000)
