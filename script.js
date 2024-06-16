document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const authButton = document.getElementById('auth-button');
    const accessToken = getCookie('access_token'); // クッキーからアクセストークンを取得

    if (accessToken) {
        // アクセストークンがある場合、ユーザー情報を取得する処理
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
                document.getElementById('user-id').innerText = `(${data.id})`;
                document.getElementById('user-info').style.display = 'block';

                // ロール付与リクエストを送信する
                fetch('https://inky-neat-thyme.glitch.me/grant_role', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        access_token: accessToken,
                        user_id: data.id
                    })
                })
                .then(response => response.json())
                .then(result => console.log('Role granted successfully:', result))
                .catch(error => console.error('Error granting role:', error));
            } else {
                console.error('Error fetching user info:', data);
            }
        })
        .catch(error => console.error('Error fetching user info:', error));
    } else {
        // アクセストークンがない場合、認証ボタンを表示
        authButton.style.display = 'inline-block';
    }
});
