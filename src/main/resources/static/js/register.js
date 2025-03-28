document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginLink = document.getElementById('login-link');

    // Navigate to login page
    loginLink.addEventListener('click', () => {
        window.location.href = '/login.html';
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const email = document.getElementById('email').value;
        const nickname = document.getElementById('nickname').value;

        // Validate password match
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    nickname
                })
            });

            if (response.ok) {
                const userData = await response.json();
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/login.html';
            } else {
                // Handle registration error
                const errorData = await response.json();
                alert(errorData.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    });
});