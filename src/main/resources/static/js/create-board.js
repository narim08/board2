document.addEventListener('DOMContentLoaded', () => { //페이지 로드 시 실행
    
    //create-board.html에서 id 가져옴
    const createBoardForm = document.getElementById('create-board-form');
    const cancelBtn = document.getElementById('cancel-btn');

    
    //작성 완료 버튼 클릭할 시 실행
    createBoardForm.addEventListener('submit', async (e) => {
        e.preventDefault(); //submit을 누르면 자동 페이지 새로고침 되는데, 그거 막음(새로고침 되기 전에 백엔드랑 통신해야돼서)

        //사용자가 입력한 입력 필드의 값을 가져와서 formData 객체에 저장
        const formData = {
            title: document.getElementById('title').value,
            userName: document.getElementById('userName').value,
            content: document.getElementById('content').value
        };

        //fetch로 백엔드 API에 POST 요청 보냄
        try {
            const response = await fetch('/api/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) //json으로 변환해서 전송
            });

            //전송 후 받은 응답 결과에 따라 처리
            if (response.ok) {
                window.location.href = 'index.html'; //성공하면 메인페이지로 돌아감
            } else {
                const errorData = await response.json();
                alert('게시글 작성 실패: ' + errorData.message); //실패하면 오류 알림
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 작성 중 오류가 발생했습니다.');
        }
    });

    
    //취소 버튼 클릭할 시 실행
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'index.html'; //메인 페이지로 돌아감
    });
});
