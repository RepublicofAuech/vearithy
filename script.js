document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const discriminator = params.get('discriminator');
    const avatar_url = params.get('avatar_url');

    const userInfoDiv = document.getElementById('user-info');
    if (username && discriminator) {
        userInfoDiv.innerHTML = `
            <p>ユーザー名: ${username}#${discriminator}</p>
            <img src="${avatar_url}" alt="Avatar" width="80" height="80">
        `;
    } else {
        userInfoDiv.innerHTML = '<p>ユーザー情報を取得できませんでした。再度認証を行ってください</p>';
    }
});
