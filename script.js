document.addEventListener('DOMContentLoaded', function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const authButton = document.getElementById('auth-button');
    const resultMessage = document.getElementById('result-message');
    const resultText = document.getElementById('result-text');
    const accessToken = getQueryParam('access_token');
    let userId;

    if (accessToken) {
        // アクセストークンがある場合、ユーザー情報を取得
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
                authButton.style.display = 'inline-block'; // 認証ボタンを表示
                userId = data.id; // ユーザーIDを保存
            } else {
                console.error('Error fetching user info:', data);
                throw new Error('Failed to fetch user info');
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            resultText.innerText = 'ユーザー情報の取得中にエラーが発生しました。再度お試しください';
            resultMessage.style.display = 'block';
        });
    }

    authButton.addEventListener('click', function() {
        if (userId) {
            // ロール付与リクエストを送信
            fetch('https://inky-neat-thyme.glitch.me/grant_role', {
                method: 'POST',
                credentials: 'include', // クッキーを含む
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    user_id: userId
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
            .then(data => {
                const roleId = data.roleId; // server.js から返された roleId を取得
                console.log('Role ID:', roleId);
                resultText.innerText = '認証中です...';
                resultMessage.style.display = 'block';
                setTimeout(function() {
                    window.location.href = 'https://republicofauech.github.io/vearithy/success/';
                }, 2000); // 2秒後に成功ページにリダイレクト
            })
            .catch(error => {
                console.error('Error granting role:', error);
                resultText.innerText = '認証中です...';
                resultMessage.style.display = 'block';
                setTimeout(function() {
                    window.location.href = 'https://republicofauech.github.io/vearithy/failure/';
                }, 2000); // 2秒後に失敗ページにリダイレクト
            });
        } else {
            resultText.innerText = 'ユーザー情報が取得されていません。再度お試しください';
            resultMessage.style.display = 'block';
        }
    });
});
