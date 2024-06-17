document.addEventListener('DOMContentLoaded', function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const authButton = document.getElementById('auth-button');
    const redirectButton = document.getElementById('redirect-button');
    const resultMessage = document.getElementById('result-message');
    const resultText = document.getElementById('result-text');
    const accessToken = getQueryParam('access_token');
    let roleId; // roleId をここで定義

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
                        role_id: roleId // roleId を追加
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
            roleId = data.roleId; // server.js から返された roleId を取得
            console.log('Role ID:', roleId);
            resultText.innerText = 'ロールが正常に付与されました。';
            resultMessage.style.display = 'block';
            redirectButton.style.display = 'inline-block';
        })
        .catch(error => {
            console.error('Error granting role:', error);
            resultText.innerText = 'ロールの付与中にエラーが発生しました。';
            resultMessage.style.display = 'block';
            redirectButton.style.display = 'inline-block';
        });

        redirectButton.addEventListener('click', function() {
            window.location.href = 'https://republicofauech.github.io/vearithy/'; // リダイレクト先のURLを設定する
        });
    } else {
        // アクセストークンがない場合、認証ボタンを表示
        authButton.style.display = 'inline-block';
    }

    authButton.addEventListener('click', function() {
        // 認証ボタンを押したときの処理
        // 仮の成功/失敗判定
        const success = true; // ここを実際の判定に合わせて変更する

        if (success) {
            resultText.innerText = '認証が成功しました。ユーザー情報を取得しています...';
        } else {
            resultText.innerText = '認証に失敗しました。再度お試しください。';
        }

        resultMessage.style.display = 'block';
        redirectButton.style.display = 'inline-block';
    });
});
