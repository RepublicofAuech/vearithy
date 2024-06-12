document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            // Discordの認証ページへリダイレクト
            window.location.href = 'https://republicofauech.github.io/vearithy/';
        });
    } else {
        console.error('Login button element not found');
    }

    fetch('http://localhost:5000/user_info.json', {
        method: 'GET',
        credentials: 'include'  // 認証情報を含める
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error) {
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('avatar').src = ''; // ユーザーのアバター画像のURLを設定する
            document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
        } else {
            console.error('Error fetching user info:', data.error);
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
});
