window.onload = async function() {
    const response = await fetch('user_info.json');
    const userInfo = await response.json();
    displayDiscordInfo(userInfo);
};

function displayDiscordInfo(info) {
    const discordInfoDiv = document.getElementById('discord-info');
    if (info.error) {
        discordInfoDiv.innerHTML = `<p>${info.error}</p>`;
    } else {
        discordInfoDiv.innerHTML = `
            <p><strong>ユーザー名:</strong> ${info.username}#${info.discriminator}</p>
            <p><strong>ID:</strong> ${info.id}</p>
            ${info.avatar ? `<img src="https://cdn.discordapp.com/avatars/${info.id}/${info.avatar}.png" alt="Avatar" width="100">` : ''}
        `;
    }
}
