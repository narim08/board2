/*
document.addEventListener('DOMContentLoaded', () => {
    const boardList = document.getElementById('board-list');
    const createBoardBtn = document.getElementById('create-board-btn');
    const paginationDiv = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    let currentPage = 0;
    let currentQuery = '';

    createBoardBtn.addEventListener('click', () => {
        window.location.href = 'create-board.html';
    });

    // 게시글 API 호출 함수
    async function fetchBoards(query = '', page = 0, size = 5) {
        try {
            const url = query
                ? `/api/board/search?title=${encodeURIComponent(query)}&page=${page}&size=${size}&sort=createTime,desc`
                : `/api/board?page=${page}&size=${size}&sort=createTime,desc`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch boards');

            const data = await response.json();

            // 게시글 리스트 렌더링
            renderBoardList(data.content);
            renderPagination(data);
        } catch (error) {
            console.error('Error fetching boards:', error);
            alert('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }

    // 게시글 리스트 렌더링 함수
    function renderBoardList(boards) {
        if (boards.length === 0) {
            boardList.innerHTML = '<p>게시글이 없습니다.</p>';
            return;
        }

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

    // 페이지네이션 렌더링 함수
    function renderPagination(data) {
        paginationDiv.innerHTML = '';
        for (let i = 0; i < data.totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i + 1;
            pageBtn.classList.add('pagination-btn');
            if (i === data.number) pageBtn.classList.add('active');

            pageBtn.addEventListener('click', () => {
                currentPage = i;
                fetchBoards(currentQuery, currentPage);
            });

            paginationDiv.appendChild(pageBtn);
        }
    }

    // 검색 버튼 클릭 이벤트
    searchBtn.addEventListener('click', () => {
        currentQuery = searchInput.value.trim();
        currentPage = 0; // 검색 시 페이지를 초기화
        fetchBoards(currentQuery, currentPage);
    });

    // 페이지 로드 시 기본 게시글 목록 불러오기
    fetchBoards();
});
*/


document.addEventListener('DOMContentLoaded', () => {
    const createBoardBtn = document.getElementById('create-board-btn');
    const boardList = document.getElementById('board-list');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/login.html';
        return;
    }

    // Function to fetch board list
    async function fetchBoards(page = 0, searchTitle = '') {
        try {
            let url = `/api/board?page=${page}&size=5&sort=createTime,desc`;
            if (searchTitle) {
                url = `/api/board/search?title=${encodeURIComponent(searchTitle)}&page=${page}&size=5&sort=createTime,desc`;
            }

            const response = await fetch(url);
            const data = await response.json();

            // Clear previous board list
            boardList.innerHTML = '';

            // Render board list
            data.content.forEach(board => {
                const boardItem = document.createElement('div');
                boardItem.classList.add('board-item');
                boardItem.innerHTML = `
                    <h3>${board.title}</h3>
                    <p>작성자: ${board.userName}</p>
                    <p>작성일: ${new Date(board.createTime).toLocaleString()}</p>
                `;
                boardItem.addEventListener('click', () => {
                    window.location.href = `/board-detail.html?id=${board.id}`;
                });
                boardList.appendChild(boardItem);
            });

            // Render pagination
            renderPagination(data);
        } catch (error) {
            console.error('Error fetching boards:', error);
            alert('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }

    // Function to render pagination
    function renderPagination(data) {
        paginationContainer.innerHTML = '';

        for (let i = 0; i < data.totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i + 1;
            pageBtn.addEventListener('click', () => fetchBoards(i, searchInput.value));
            paginationContainer.appendChild(pageBtn);
        }
    }

    // Initial fetch
    fetchBoards();

    // Create board button
    createBoardBtn.addEventListener('click', () => {
        window.location.href = '/create-board.html';
    });

    // Search functionality
    searchBtn.addEventListener('click', () => {
        fetchBoards(0, searchInput.value);
    });

    // Add a logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = '로그아웃';
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        window.location.href = '/login.html';
    });
    document.querySelector('.container').insertBefore(logoutBtn, createBoardBtn);
});