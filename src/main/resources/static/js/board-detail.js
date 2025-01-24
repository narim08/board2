document.addEventListener('DOMContentLoaded', () => {
    const boardDetail = document.getElementById('board-detail');
    const backToListBtn = document.getElementById('back-to-list-btn');
    const editBoardBtn = document.getElementById('edit-board-btn');
    const deleteBoardBtn = document.getElementById('delete-board-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('id');
    let editingCommentId = null;

    async function fetchBoardDetail() {
        try {
            const response = await fetch(`/api/board/${boardId}`);
            const board = await response.json();

            boardDetail.innerHTML = `
                <h1>${board.title}</h1>
                <div class="board-detail-meta">
                    <div>
                        <span>작성자: ${board.userName}</span>
                    </div>
                    <div>
                        <span>생성일: ${formatDate(board.createTime)}</span>
                        <span> | </span>
                        <span>수정일: ${formatDate(board.updateTime)}</span>
                    </div>
                </div>
                <div class="board-content">
                    ${board.content.replace(/\n/g, '<br>')}
                </div>
                <div id="comments-section">
                    <h3>댓글</h3>
                    <div id="comments-list"></div>
                    <form id="comment-form">
                        <input type="text" id="comment-username" placeholder="이름" required>
                        <textarea id="comment-content" placeholder="댓글을 작성하세요" required></textarea>
                        <button type="submit">댓글 작성</button>
                    </form>
                </div>
            `;

            setupCommentForm();
            await fetchComments();
        } catch (error) {
            console.error('Error:', error);
            alert('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }

    async function fetchComments() {
        const commentsList = document.getElementById('comments-list');

        try {
            const response = await fetch(`/api/board/${boardId}/comment`);
            const comments = await response.json();

            commentsList.innerHTML = comments.map(comment => `
                <div class="comment" data-comment-id="${comment.id}">
                    <div class="comment-meta">
                        <strong>${comment.userName}</strong>
                        <span>생성일: ${formatDate(comment.createTime)} | 수정일: ${formatDate(comment.updateTime)}</span>
                    </div>
                    <div class="comment-content">
                        ${comment.content}
                    </div>
                    <div class="comment-actions">
                        <button class="edit-comment-btn">수정</button>
                        <button class="delete-comment-btn">삭제</button>
                    </div>
                </div>
            `).join('');

            // 댓글 이벤트 리스너 등록
            setupCommentsEventListener();
        } catch (error) {
            console.error('Comments fetch error:', error);
        }
    }

    function setupCommentsEventListener() {
        const commentsList = document.getElementById('comments-list');

        // 기존 이벤트 리스너 제거
        commentsList.removeEventListener('click', handleCommentActions);
        commentsList.addEventListener('click', handleCommentActions);
    }

    function handleCommentActions(e) {
        const commentElement = e.target.closest('.comment');
        if (!commentElement) return;

        const commentId = commentElement.dataset.commentId;

        if (e.target.classList.contains('edit-comment-btn')) {
            startEditComment(commentElement);
        } else if (e.target.classList.contains('delete-comment-btn')) {
            deleteComment(commentId);
        }
    }

    function setupCommentForm() {
        const commentForm = document.getElementById('comment-form');
        const commentUsernameInput = document.getElementById('comment-username');
        const commentContentInput = document.getElementById('comment-content');
        const submitButton = commentForm.querySelector('button');

        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                userName: commentUsernameInput.value,
                content: commentContentInput.value
            };

            try {
                let response;
                if (editingCommentId) {
                    // 댓글 수정
                    response = await fetch(`/api/board/${boardId}/comment/${editingCommentId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                } else {
                    // 새 댓글 작성
                    response = await fetch(`/api/board/${boardId}/comment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                }

                if (response.ok) {
                    await fetchComments();
                    commentForm.reset();
                    editingCommentId = null;
                    submitButton.textContent = '댓글 작성';
                    document.getElementById('comment-username').removeAttribute('disabled'); // Re-enable username field
                } else {
                    alert('댓글 작성/수정 실패');
                }
            } catch (error) {
                console.error('Comment submit error:', error);
            }
        });
    }


    function startEditComment(commentElement) {
        const commentId = commentElement.dataset.commentId;
        const commentContent = commentElement.querySelector('.comment-content').innerText.trim();  // innerText로 공백 제거
        const commentUsername = commentElement.querySelector('strong').innerText;  // 작성자

        // 폼에 기존 댓글 정보 채우기
        const usernameInput = document.getElementById('comment-username');
        const contentInput = document.getElementById('comment-content');
        const submitButton = document.querySelector('#comment-form button');

        usernameInput.value = commentUsername;
        usernameInput.setAttribute('disabled', 'true'); // 작성자 칸 비활성화

        contentInput.value = commentContent;  // 댓글 내용 설정
        editingCommentId = commentId;

        submitButton.textContent = '댓글 수정';
    }

    async function deleteComment(commentId) {
        if (confirm('정말 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`/api/board/${boardId}/comment/${commentId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await fetchComments(); //댓글 목록 새로고침
                } else {
                    alert('댓글 삭제 실패');
                }
            } catch (error) {
                console.error('Comment delete error:', error);
            }
        }
    }

    // 기존 게시글 관련 이벤트 리스너들...
    backToListBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    editBoardBtn.addEventListener('click', () => {
        window.location.href = `edit-board.html?id=${boardId}`;
    });

    deleteBoardBtn.addEventListener('click', async () => {
        if (confirm('정말 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`/api/board/${boardId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    alert('게시글 삭제 실패');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('게시글 삭제 중 오류가 발생했습니다.');
            }
        }
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    fetchBoardDetail();
});