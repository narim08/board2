document.addEventListener('DOMContentLoaded', () => { //페이지 로드 시 실행

    //board-detail.html에서 id 가져옴
    const boardDetail = document.getElementById('board-detail');
    const backToListBtn = document.getElementById('back-to-list-btn');
    const editBoardBtn = document.getElementById('edit-board-btn');
    const deleteBoardBtn = document.getElementById('delete-board-btn');

    const urlParams = new URLSearchParams(window.location.search); //현재 페이지 URL에서 쿼리 문자열 추출(ex: ?id=12)
    const boardId = urlParams.get('id'); //거기서 id값만 추출(ex: 12), 그게 상세 조회할 게시글 id가 됨 
    let editingCommentId = null;

    
    //게시글 상세 조회 요청 함수 (API: GET 요청) / async: 비동기 작업 필요한 경우(API(네트워크)요청 필요해서 await 함께 써서 지연시킴)
    async function fetchBoardDetail() {
        try {
            const response = await fetch(`/api/board/${boardId}`); //해당 게시글의 상세 내용 가져오라고 요청 보냄
            const board = await response.json(); //가져온 거 json으로 저장

            //board-detail.html에 동적으로 추가되는 부분
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
            await fetchComments(); //await fetch: 비동기 요청이 끝날 때까지 기다림
            
        } catch (error) {
            console.error('Error:', error);
            alert('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }


    //댓글 전체 조회 요청 함수 (API: GET 요청)
    async function fetchComments() {
        //위 동적 html에서 id 가져옴
        const commentsList = document.getElementById('comments-list');

        try {
            const response = await fetch(`/api/board/${boardId}/comment`); //댓글 전체 가져오라고 요청 보냄
            const comments = await response.json(); //가져온 거 json으로 저장

            //가져온 댓글들 동적으로 추가됨(여기서 map으로 저장하면 위 comment-list div칸쪽에 추가됨)
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
            `).join(''); //map 배열로 댓글들 저장할 때 쉼표 제거

            //댓글 이벤트 리스너 등록
            setupCommentsEventListener();
            
        } catch (error) {
            console.error('Comments fetch error:', error);
        }
    }


    //async없는 일반 함수: 네트워크 요청 필요x, 그냥 한줄씩 순차적으로 실행됨 
    function setupCommentsEventListener() {
        const commentsList = document.getElementById('comments-list');

        commentsList.removeEventListener('click', handleCommentActions); //기존 이벤트 리스너 제거
        commentsList.addEventListener('click', handleCommentActions); //새 이벤트 리스너 추가
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


    //댓글 작성 및 수정 함수
    function setupCommentForm() {
        const commentForm = document.getElementById('comment-form');
        const commentUsernameInput = document.getElementById('comment-username');
        const commentContentInput = document.getElementById('comment-content');
        const submitButton = commentForm.querySelector('button');

        //댓글 작성 및 수정 후 API로 통신 (async + await 붙음 == API(네트워크) 요청 필요 
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault(); //submit을 누르면 자동 페이지 새로고침 되는데, 그거 막음(새로고침 되기 전에 백엔드랑 통신해야돼서)

            //입력 필드 내용 가져옴
            const formData = {
                userName: commentUsernameInput.value,
                content: commentContentInput.value
            };

            //백엔드와 API로 통신
            try {
                let response;
                if (editingCommentId) { //댓글 수정인 경우
                    response = await fetch(`/api/board/${boardId}/comment/${editingCommentId}`, { //수정 요청 보냄(PUT)
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                } else { //새 댓글 작성인 경우
                    response = await fetch(`/api/board/${boardId}/comment`, { //작성(생성) 요청 보냄(POST)
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                }

                //백엔드의 응답 결과에 따라 처리
                if (response.ok) {
                    await fetchComments(); //댓글 전체 조회 요청 함수 호출 (==바로 댓글 목록 갱신한다는 뜻)
                    commentForm.reset();
                    editingCommentId = null; //다시 수정 모드 끔
                    submitButton.textContent = '댓글 작성';
                    document.getElementById('comment-username').removeAttribute('disabled'); //작성자 필드 끈 거 취소
                } else {
                    alert('댓글 작성/수정 실패');
                }
            } catch (error) {
                console.error('Comment submit error:', error);
            }
        });
    }


    //댓글 수정 함수
    function startEditComment(commentElement) {
        const commentId = commentElement.dataset.commentId;
        const commentContent = commentElement.querySelector('.comment-content').innerText.trim();  //innerText로 공백 제거
        const commentUsername = commentElement.querySelector('strong').innerText;  //작성자

        //입력 필드에 기존 댓글 정보 채우기(수정할 때 기존 내용 보여야 되니까)
        const usernameInput = document.getElementById('comment-username');
        const contentInput = document.getElementById('comment-content');
        const submitButton = document.querySelector('#comment-form button');

        usernameInput.value = commentUsername;
        usernameInput.setAttribute('disabled', 'true'); //작성자 칸 비활성화(수정할 때 건드리면 안됨)

        contentInput.value = commentContent;  //댓글 내용 설정
        editingCommentId = commentId;

        submitButton.textContent = '댓글 수정';
    }


    //댓글 삭제 함수(DELETE 요청 보냄)
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

    
    // 기존 게시글 관련 이벤트 리스너들
    //목록으로 돌아가는 버튼 이벤트
    backToListBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    //게시글 수정 버튼 이벤트
    editBoardBtn.addEventListener('click', () => {
        window.location.href = `edit-board.html?id=${boardId}`;
    });

    //게시글 삭제 버튼 이벤트
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

    
    //시간 포맷 변환 함수
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

    fetchBoardDetail(); //페이지 로드 시 이 함수부터 실행
});
