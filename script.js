@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return "No code provided", 400

    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'scope': 'identify',
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post(TOKEN_URL, data=data, headers=headers)
    if response.status_code != 200:
        return f"Failed to fetch access token: {response.text}", 500

    response_data = response.json()
    access_token = response_data.get('access_token')

    if access_token:
        response = make_response(redirect('https://republicofauech.github.io/vearithy/'))
        response.set_cookie('access_token', access_token, httponly=True, samesite='None', secure=True)
        print("Access token set in cookie:", access_token)
        return response
    else:
        return "Error fetching access token", 500
