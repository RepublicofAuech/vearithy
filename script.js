document.getElementById('login-button').addEventListener('click', function() {
    window.location.href = 'http://localhost:5000/login';
});

window.onload = function() {
    fetch('http://localhost:5000/user_info.json', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error) {
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('avatar').src = data.avatar_url;
            document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
        }
    })
    .catch(error => console.error('Error fetching user info:', error));
};
