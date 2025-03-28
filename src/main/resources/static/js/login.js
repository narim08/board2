document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerLink = document.getElementById('register-link');

    // Navigate to registration page
    registerLink.addEventListener('click', () => {
        window.location.href = '/register.html';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const userData = await response.json();
                // Store user information in localStorage
                localStorage.setItem('username', userData.username);

                // Redirect to board list
                window.location.href = '/index.html';
            } else {
                // Handle login error
                const errorData = await response.json();
                alert(errorData.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    });
});