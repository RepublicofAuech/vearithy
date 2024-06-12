document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/user_info.json');
        const data = await response.json();

        const userInfoDiv = document.getElementById('user-info');
        if (data.error) {
            userInfoDiv.innerHTML = '<p>ユーザー情報を取得できませんでした。再度認証を行ってください</p>';
        } else {
            userInfoDiv.innerHTML = `
                <p>ユーザー名: ${data.username}#${data.discriminator}</p>
                <img src="${data.avatar_url}" alt="Avatar" width="80" height="80">
            `;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
});
