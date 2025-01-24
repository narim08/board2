document.addEventListener('DOMContentLoaded', () => {
    const editBoardForm = document.getElementById('edit-board-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('id');

    async function fetchBoardDetail() {
        try {
            const response = await fetch(`/api/board/${boardId}`);
            const board = await response.json();

            titleInput.value = board.title;
            contentInput.value = board.content;
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 정보를 불러오는 중 오류가 발생했습니다.');
        }
    }

    editBoardForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            title: titleInput.value,
            content: contentInput.value
        };

        try {
            const response = await fetch(`/api/board/${boardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.location.href = `board-detail.html?id=${boardId}`;
            } else {
                const errorData = await response.json();
                alert('게시글 수정 실패: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = `board-detail.html?id=${boardId}`;
    });

    fetchBoardDetail();
});