from flask import Flask, redirect, request, jsonify
import os
import json

app = Flask(__name__)

@app.route('/verify')
def verify():
    return redirect("https://discord.com/oauth2/authorize?client_id=1245921092879650917&permissions=8&integration_type=0&scope=bot")

@app.route('/callback')
def callback():
    code = request.args.get('code')
    # DiscordのOAuth2トークン取得およびユーザー情報取得のロジックをここに追加
    # 取得したユーザー情報をuser_info.jsonに保存する

    user_info = {
        "username": "example_user",
        "discriminator": "1234",
        "id": "123456789012345678",
        "avatar_url": "https://cdn.discordapp.com/avatars/123456789012345678/a_abcdef1234567890.webp"
    }
    with open('user_info.json', 'w') as f:
        json.dump(user_info, f)

    return redirect('/')

@app.route('/user_info.json')
def user_info():
    with open('user_info.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=5000)
