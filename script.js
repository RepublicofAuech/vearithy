document.addEventListener("DOMContentLoaded", function() {
    fetch("/user_info.json")
        .then(response => response.json())
        .then(data => {
            const userInfoDiv = document.getElementById("user-info");
            if (data.error) {
                userInfoDiv.innerHTML = "<p>ユーザー情報を取得できませんでした。</p>";
            } else {
                userInfoDiv.innerHTML = `
                    <p>ユーザーネーム: ${data.username}#${data.discriminator}</p>
                    <p>ID: ${data.id}</p>
                    ${data.avatar_url ? `<img src="${data.avatar_url}" alt="Avatar">` : ""}
                `;
            }
        });
});
