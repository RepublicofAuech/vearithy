document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/user_info.json');
        const data = await response.json();
        
        const userInfoDiv = document.getElementById('user-info');
        if (data.username && data.discriminator) {
            userInfoDiv.innerHTML = `
                <p>ユーザー名: ${data.username}#${data.discriminator}</p>
                <img src="${data.avatar_url}" alt="Avatar" width="80" height="80">
            `;
        } else {
            userInfoDiv.innerHTML = '<p>ユーザー情報を取得できませんでした。\n再度認証を行ってください</p>';
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.innerHTML = '<p>ユーザー情報を取得できませんでした。\n再度認証を行ってください</p>';
    }
});
