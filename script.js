document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=None; Secure";
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const code = getQueryParam('code');
    if (code) {
        fetch(`https://inky-neat-thyme.glitch.me/callback?code=${code}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                setCookie('access_token', data.access_token, 1);
                window.location.replace("/"); // トークンが取得できたらページをリロード
            } else {
                console.error('Error retrieving access token:', data);
            }
        })
        .catch(error => console.error('Error retrieving access token:', error));
    }

    const accessToken = getCookie('access_token');

    if (!accessToken) {
        document.getElementById('auth-warning').style.display = 'block';
        return;
    }

    fetch('https://inky-neat-thyme.glitch.me/user_info', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
            document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
            document.getElementById('user-info').style.display = 'block';
        } else {
            console.error('Error fetching user info:', data);
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
});
