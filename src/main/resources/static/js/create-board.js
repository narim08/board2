document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/login.html';
        return;
    }

    const createBoardForm = document.getElementById('create-board-form');
    const cancelBtn = document.getElementById('cancel-btn');

    // Remove userName input as it will be fetched from authentication
    document.getElementById('userName').value = username;
    document.getElementById('userName').disabled = true;

    createBoardForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch('/api/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Username': username
                },
                body: JSON.stringify({
                    title,
                    userName: username,
                    content
                })
            });

            if (response.ok) {
                window.location.href = '/index.html';
            } else {
                const errorData = await response.json();
                alert(errorData.message || '게시글 작성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Create board error:', error);
            alert('게시글 작성 중 오류가 발생했습니다.');
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
    });
});