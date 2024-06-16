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

    const accessToken = getCookie('access_token');

    if (!accessToken) {
        document.getElementById('auth-warning').style.display = 'block';
        return;
    }

    // ユーザー情報を取得して表示する
    fetch('https://inky-neat-thyme.glitch.me/user_info', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            const userInfoDiv = document.getElementById('user-info');
            document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
            document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
            userInfoDiv.style.display = 'block';
        } else {
            console.error('Error fetching user info:', data);
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
});
