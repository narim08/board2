document.addEventListener('DOMContentLoaded', () => {
    const createBoardForm = document.getElementById('create-board-form');
    const cancelBtn = document.getElementById('cancel-btn');

    createBoardForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value,
            userName: document.getElementById('userName').value,
            content: document.getElementById('content').value
        };

        try {
            const response = await fetch('/api/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                const errorData = await response.json();
                alert('게시글 작성 실패: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 작성 중 오류가 발생했습니다.');
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});