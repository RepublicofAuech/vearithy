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
            ${info.avatar_url ? `<img src="${info.avatar_url}" alt="Avatar" width="100">` : ''}
        `;
    }
}

document.getElementById('verify-btn').onclick = function() {
    window.location.href = 'https://republicofauech.github.io/vearithy/';
};
