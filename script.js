document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const accessToken = getCookie('access_token');
    console.log("Access token from cookie:", accessToken);

    if (!accessToken) {
        console.log('No access token found in cookies.');
        return;
    }

    fetch('http://localhost:5000/user_info.json', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('User data:', data);
        if (!data.error) {
            const userInfoDiv = document.getElementById('user-info');
            userInfoDiv.innerHTML = `
                <img id="avatar" src="${data.avatar_url}" alt="Avatar">
                <p id="username">${data.username}#${data.discriminator}</p>
            `;
        } else {
            console.error('Error fetching user info:', data.error);
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
});
