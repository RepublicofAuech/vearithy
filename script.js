document.addEventListener('DOMContentLoaded', function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const authButton = document.getElementById('auth-button');
    const accessToken = getQueryParam('access_token');

    if (accessToken) {
        // アクセストークンがある場合、ユーザー情報を取得してロール付与を試みる
        fetch('https://inky-neat-thyme.glitch.me/user_info', {
            method: 'GET',
            credentials: 'include', // クッキーを含む
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            return response.json();
        })
        .then(data => {
            if (data.id) {
                // ユーザー情報を表示
                document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
                document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
                document.getElementById('user-id').innerText = `(${data.id})`;
                document.getElementById('user-info').style.display = 'block';

                // ロール付与リクエストを送信
                return fetch('https://inky-neat-thyme.glitch.me/grant_role', {
                    method: 'POST',
                    credentials: 'include', // クッキーを含む
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        access_token: accessToken,
                        user_id: data.id,
                        role_id: roleId // server.js からの role_id を追加
                    })
                });
            } else {
                console.error('Error fetching user info:', data);
                throw new Error('Failed to fetch user info');
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Failed to grant role: ${errorData.error}`);
                });
            }
            return response.json();
        })
        .then(data => {
            const roleId = data.roleId; // server.js から返された roleId を取得
            console.log('Role ID:', roleId);
            // ここで roleId を使って適切な処理を行う
        })
        .catch(error => {
            console.error('Error granting role:', error);
            // エラー時の処理を記述
        });
    } else {
        // アクセストークンがない場合、認証ボタンを表示
        authButton.style.display = 'inline-block';
    }
});
