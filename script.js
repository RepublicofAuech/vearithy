document.getElementById('auth-button').addEventListener('click', authenticate);

function authenticate() {
    // 認証リンクにリダイレクト
    window.location.href = "http://localhost:5000/verify";
}

// 認証後にユーザー情報を取得して表示
window.onload = async function() {
    const response = await fetch('user_info.json');
    const userInfo = await response.json();
    displayDiscordInfo(userInfo);
};

function displayDiscordInfo(info) {
    const discordInfoDiv = document.getElementById('discord-info');
    discordInfoDiv.innerHTML = `
        <p><strong>ユーザー名:</strong> ${info.username}#${info.discriminator}</p>
        <p><strong>ID:</strong> ${info.id}</p>
        ${info.avatar_url ? `<img src="${info.avatar_url}" alt="Avatar" width="100">` : ''}
    `;
}
