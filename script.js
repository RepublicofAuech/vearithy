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

    // クエリパラメータからアクセストークンを取得し、クッキーに保存する
    const accessTokenFromQuery = getQueryParam('access_token');
    if (accessTokenFromQuery) {
        setCookie('access_token', accessTokenFromQuery, 1);
        console.log("Access token from query:", accessTokenFromQuery);
        // URLからクエリパラメータを削除
        window.history.replaceState({}, document.title, "/vearithy/");
    }

    const accessToken = getCookie('access_token');
    console.log("Access token from cookie:", accessToken);

    // 注意喚起メッセージを表示する
    const authWarning = document.getElementById('auth-warning');
    authWarning.style.display = 'block';

    if (!accessToken) {
        console.log('No access token found in cookies.');
        return;
    }

    // ユーザー情報を取得して表示する
    fetch('https://localhost:5000/user_info.json', {
        method: 'GET',
        credentials: 'include'  // 認証情報を含める
    })
    .then(response => {
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('User data:', data);
        if (!data.error) {
            // ユーザー情報を表示する
            const userInfoDiv = document.getElementById('user-info');
            userInfoDiv.innerHTML = `
                <img id="avatar" src="${data.avatar_url}" alt="Avatar">
                <p id="username">${data.username}#${data.discriminator}</p>
            `;
            userInfoDiv.style.display = 'block';
        } else {
            console.error('Error fetching user info:', data.error);
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
});
