document.addEventListener('DOMContentLoaded', () => { //페이지 로드 시 실행

    //edit-board.html에서 id 가져옴
    const editBoardForm = document.getElementById('edit-board-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
 
    const urlParams = new URLSearchParams(window.location.search); //현재 페이지 URL에서 쿼리 문자열 추출(ex: ?id=12)
    const boardId = urlParams.get('id'); //거기서 id값만 추출(ex: 12), 그게 수정할 게시글 id가 됨 

    
    //fetch로 백엔드에 API 보냄 (GET 요청)
    async function fetchBoardDetail() {
        try {
            const response = await fetch(`/api/board/${boardId}`); //수정할 게시글의 기존 내용들 가져오라고 요청 보냄
            const board = await response.json(); //가져온거 json으로 저장

            //가져온 거에서 제목이랑 내용만 입력 폼에다가 넣음(수정할 때 기존 내용이 보여야 되니까 가져옴)
            titleInput.value = board.title;
            contentInput.value = board.content;
            
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 정보를 불러오는 중 오류가 발생했습니다.');
        }
    }

    
    //수정 완료 버튼 클릭 시 실행
    editBoardForm.addEventListener('submit', async (e) => {
        e.preventDefault(); //submit을 누르면 자동 페이지 새로고침 되는데, 그거 막음(새로고침 되기 전에 백엔드랑 통신해야돼서)

        //사용자가 작성한 내용을 객체에 담음
        const formData = {
            title: titleInput.value,
            content: contentInput.value
        };

        //백엔드로 API 호출해서 수정해달라고(PUT) 보냄
        try {
            const response = await fetch(`/api/board/${boardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) //수정한 내용 json으로 보냄
            });

            //백엔드의 응답 결과에 따라 처리
            if (response.ok) {
                window.location.href = `board-detail.html?id=${boardId}`; //성공 시 상세 조회 화면으로 이동(수정된 화면)
            } else {
                const errorData = await response.json();
                alert('게시글 수정 실패: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        }
    });


    //취소 버튼 클릭 시 실행
    cancelBtn.addEventListener('click', () => {
        window.location.href = `board-detail.html?id=${boardId}`; //기존 상세 조회 화면으로 이동(수정 안 한 화면)
    });

    fetchBoardDetail(); //이 페이지 로드되면 이 함수부터 실행 
});
