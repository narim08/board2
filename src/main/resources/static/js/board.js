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

    const profileIcon = document.getElementById('profile-icon');
    profileIcon.addEventListener('click', () => {
        window.location.href = '/mypage.html';
    });
    // 로그인한 사용자의 프로필 사진 설정
    const userProfile = localStorage.getItem('profileImage');
    if (userProfile) {
        profileIcon.src = userProfile;
    }
    // 로그아웃 버튼 기능 추가
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        window.location.href = '/login.html';
    });

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

    /*// Add a logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = '로그아웃';
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        window.location.href = '/login.html';
    });*/

    document.querySelector('.container').insertBefore(logoutBtn, createBoardBtn);
});