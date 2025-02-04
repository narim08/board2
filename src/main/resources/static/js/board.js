document.addEventListener('DOMContentLoaded', () => { //페이지 로드 시 실행
    
    //index.html의 id(변수) 가져옴
    const boardList = document.getElementById('board-list');
    const createBoardBtn = document.getElementById('create-board-btn');
    const paginationDiv = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    let currentPage = 0;
    let currentQuery = ''; //검색어(현재 빈칸)

    
    //게시글 작성 버튼 클릭 이벤트
    createBoardBtn.addEventListener('click', () => {
        window.location.href = 'create-board.html'; //작성 화면으로 이동
    });

    
    //게시글 불러오는 함수(API로부터 호출, 5개씩 가져옴)
    async function fetchBoards(query = '', page = 0, size = 5) {
        try { //검색어(query)가 있으면 검색 API 호출, 없으면 그냥 전체 목록 가져옴
            const url = query 
                ? `/api/board/search?title=${encodeURIComponent(query)}&page=${page}&size=${size}&sort=createTime,desc`
                : `/api/board?page=${page}&size=${size}&sort=createTime,desc`;

            const response = await fetch(url); //fetch: 백엔드에게 API 요청하는 함수 -> 응답 결과 저장
            if (!response.ok) throw new Error('Failed to fetch boards'); 

            const data = await response.json(); //응답 결과를 json으로 저장

            renderBoardList(data.content); //게시글 리스트 렌더링 함수 호출
            renderPagination(data);        //페이지네이션 렌더링 함수 호출
            
        } catch (error) {
            console.error('Error fetching boards:', error);
            alert('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }

    
    //게시글 리스트 렌더링 함수
    function renderBoardList(boards) {
        if (boards.length === 0) {
            boardList.innerHTML = '<p>게시글이 없습니다.</p>';
            return;
        }

        //index.html board-list 부분에 동적으로 추가됨(도메인 설계때 정했던 변수 이름으로 가져옴)
        //createTime은 한국 날짜 형식으로 표현하기 위해 변환 작업 필요
        //map: boards(응답 결과:게시글들)배열에 있는 각 게시글을 HTML 문자열로 변환 -> join("")으로 배열 요소 사이 쉼표 제거
        boardList.innerHTML = boards
            .map(board => `
                <div class="board-item">
                    <a href="/board-detail.html?id=${board.id}">${board.title}</a>
                    <div class="board-meta">
                        <span>${board.userName}</span>
                        <span>${new Date(board.createTime).toLocaleDateString('ko-KR')}</span>
                    </div>
                </div>
            `).join('');
    }

    
    //페이지네이션 렌더링 함수
    function renderPagination(data) {
        paginationDiv.innerHTML = '';     //기존 버튼 초기화
        
        for (let i = 0; i < data.totalPages; i++) { //전체 페이지 수만큼 버튼 생성
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i + 1;
            pageBtn.classList.add('pagination-btn');
            if (i === data.number) pageBtn.classList.add('active'); //현재 페이지(data.number)는 active 클래스 추가하여 구분

            //버튼 클릭 시 해당 페이지로 이동동
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                fetchBoards(currentQuery, currentPage);
            });

            paginationDiv.appendChild(pageBtn);
        }
    }

    
    //검색 버튼 클릭 이벤트
    searchBtn.addEventListener('click', () => {
        currentQuery = searchInput.value.trim();
        currentPage = 0;     // 검색 시 페이지를 초기화
        fetchBoards(currentQuery, currentPage);
    });

    
    //페이지 로드 시 기본 게시글 목록 불러오기
    fetchBoards();
});


