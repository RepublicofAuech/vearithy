document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'http://localhost:5000/login';
        });
    } else {
        console.error('Login button element not found');
    }

    // クッキーからアクセストークンを取得する関数
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    // アクセストークンを取得し、ユーザー情報を取得する
    var accessToken = getCookie('access_token');
    if (accessToken) {
        fetch('http://localhost:5000/user_info.json', {
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
                document.getElementById('user-info').style.display = 'block';
                document.getElementById('avatar').src = data.avatar_url;
                document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
            } else {
                console.error('Error fetching user info:', data.error);
            }
        })
        .catch(error => console.error('Error fetching user info:', error));
    } else {
        console.log('No access token found in cookies.');
    }
});
