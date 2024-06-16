document.addEventListener('DOMContentLoaded', function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const accessToken = getQueryParam('access_token');

    if (!accessToken) {
        document.getElementById('auth-warning').style.display = 'block';
        return;
    }

    fetch('https://inky-neat-thyme.glitch.me/user_info', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
            document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
            document.getElementById('user-info').style.display = 'block';
        } else {
            console.error('Error fetching user info:', data);
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
});
