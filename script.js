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

    // クエリパラメータからコードを取得し、トークンを取得するためのリクエストを送信する
    const code = getQueryParam('code');
    if (code) {
        fetch(`https://gabby-buttercup-salmonberry.glitch.me/callback?code=${code}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                setCookie('access_token', data.access_token, 1);
                window.location.replace("/"); // リダイレクト先を適宜変更する
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

    // ユーザー情報を取得して表示する
    fetch('https://your-glitch-project-name.glitch.me/user_info.json', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            const userInfoDiv = document.getElementById('user-info');
            userInfoDiv.innerHTML = `
                <img id="avatar" src="https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png" alt="Avatar">
                <p id="username">${data.username}#${data.discriminator}</p>
            `;
            userInfoDiv.style.display = 'block';
        } else {
            console.error('Error fetching user info:', data);
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
});
