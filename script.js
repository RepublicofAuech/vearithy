document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
        try {
            const response = await fetch(`https://republicofauech.github.io/vearithy/user_info.json?access_token=${encodeURIComponent(accessToken)}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('User not authenticated');
            }
            const userInfo = await response.json();
            document.getElementById('username').textContent = `${userInfo.username}#${userInfo.discriminator}`;
            document.getElementById('avatar').src = userInfo.avatar_url;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    } else {
        console.error('No access token found');
    }
});
