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
                fetch('https://inky-neat-thyme.glitch.me/grant_role', {
                    method: 'POST',
                    credentials: 'include', // クッキーを含む
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        access_token: accessToken,
                        user_id: data.id
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(`Failed to grant role: ${errorData.error}`);
                        });
                    }
                    return response.json();
                })
                .then(result => console.log('Role granted successfully:', result))
                .catch(error => {
                    console.error('Error granting role:', error);
                    alert('ロール付与中にエラーが発生しました。管理者に問い合わせてください。');
                });
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
