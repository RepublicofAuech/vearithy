document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'http://localhost:5000/login';
        });
    } else {
        console.error('Login button element not found');
    }

    function getCookie(name) {
        let cookieArr = document.cookie.split(";");
        for (let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("=");
            if (name === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }

    let accessToken = getCookie("access_token");
    console.log("Access token from cookie:", accessToken);

    if (accessToken) {
        fetch('http://localhost:5000/user_info.json', {
            method: 'GET',
            credentials: 'include'  // 認証情報を含める
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
                document.getElementById('user-info').style.display = 'block';
                document.getElementById('avatar').src = data.avatar_url;
                document.getElementById('username').innerText = `${data.username}#${data.discriminator}`;
            } else {
                console.error('Error fetching user info:', data.error);
            }
        })
        .catch(error => console.error('Error fetching user info:', error));
    } else {
        console.log("No access token found in cookies.");
        document.getElementById('user-info').innerHTML = `<p>No access token found in cookies.</p>`;
    }
});
