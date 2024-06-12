document.addEventListener('DOMContentLoaded', function() {
    // Add event listener inside DOMContentLoaded event
    document.getElementById('login-button').addEventListener('click', function() {
        window.location.href = 'http://localhost:5000/login';
    });

    fetch('http://localhost:5000/user_info.json', {
        method: 'GET',
        credentials: 'include'  // Include credentials in the request
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error) {
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('avatar').src = data.avatar_url;
            document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
        } else {
            console.error('Error fetching user info:', data.error);
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
});
