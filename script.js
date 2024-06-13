document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
 　　　  const cookieValue = `; ${document.cookie}`;
  　　　 const cookieParts = cookieValue.split(`; ${name}=`);
   　　　if (cookieParts.length === 2) {
　　　　　　　return cookieParts.pop().split(';').shift();
 　　　　} else {
　　　　　　　return null;
　　　　 }
　　}

    const accessToken = getCookie('access_token');
    console.log("Access token from cookie:", accessToken);

    if (!accessToken) {
        console.log('No access token found in cookies.');
        return;
    }

    fetch('https://localhost:5000/user_info.json', {
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
