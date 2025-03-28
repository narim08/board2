package board.board.service;

import board.board.domain.Board;
import board.board.domain.User;
import board.board.dto.BoardRequestDTO;
import board.board.dto.BoardResponseDTO;
import board.board.repository.BoardRepository;
import board.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor //final 변수를 자동 생성자 주입해줌
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    /** Create: 게시글 작성 */
    /** Request: 제목, 작성자, 내용*/
    @Transactional
    public BoardResponseDTO createBoard(String username, BoardRequestDTO boardRequestDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Board board = new Board();
        board.setUser(user);
        board.setTitle(boardRequestDTO.getTitle());
        board.setContent(boardRequestDTO.getContent());
        board.setCreateTime(LocalDateTime.now());
        board.setUpdateTime(LocalDateTime.now());

        Board savedBoard = boardRepository.save(board);
        return convertToResponseDTO(savedBoard);
    }


    /** Read: 게시글 조회 */
    //게시글 전체 목록 조회 - 페이징 x
    /*public List<BoardResponseDTO> getAllBoards() {
        return boardRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }*/
    //게시글 전체 목록 조회 - 페이징 o
    public Page<BoardResponseDTO> getAllBoards(Pageable pageable) {
        Page<Board> boards = boardRepository.findAll(pageable);

        return boards.map(this::convertToResponseDTO);
    }

    //게시글 상세 조회
    @Transactional
    public BoardResponseDTO getBoardById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        increaseViewCount(board); //조회수 증가
        return convertToResponseDTO(board);
    }
    @Transactional
    public void increaseViewCount(Board board) {
        board.increaseViewCount(); // 조회수 증가
    }

    //게시글 검색 조회 (제목)
    public Page<BoardResponseDTO> searchBoardsByTitle(String title, Pageable pageable) {
        Page<Board> boards;

        if (title == null || title.isEmpty()) {
            // 검색어가 없으면 전체 목록 반환
            boards = boardRepository.findAll(pageable);
        } else {
            // 제목으로 검색
            boards = boardRepository.findByTitleContainingIgnoreCase(title, pageable);
        }

        return boards.map(this::convertToResponseDTO);
    }


    /** Update: 게시글 수정 */
    /** Request: 제목, 내용*/
    @Transactional
    public BoardResponseDTO updateBoard(String username, Long boardId, BoardRequestDTO boardRequestDTO) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // Check if the user is the board's owner
        if (!board.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to update this board");
        }

        board.setTitle(boardRequestDTO.getTitle());
        board.setContent(boardRequestDTO.getContent());
        board.setUpdateTime(LocalDateTime.now());

        //Board updateBoard = boardRepository.save(board); //transactional 에서 자동 변경감지로 업뎃해줌
        return convertToResponseDTO(board);
    }


    /** Delete: 게시글 삭제 */
    @Transactional
    public void deleteBoard(String username, Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // Check if the user is the board's owner
        if (!board.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this board");
        }

        boardRepository.delete(board);
    }


    /** Response DTO 변환 */
    /** Response: id, 제목, 작성자, 내용, 생성일, 수정일 */
    private BoardResponseDTO convertToResponseDTO(Board board) {
        BoardResponseDTO responseDTO = new BoardResponseDTO();

        responseDTO.setId(board.getId());
        responseDTO.setTitle(board.getTitle());
        responseDTO.setUserName(board.getUser().getUsername());
        responseDTO.setContent(board.getContent());
        responseDTO.setCreateTime(board.getCreateTime());
        responseDTO.setUpdateTime(board.getUpdateTime());
        responseDTO.setViewCount(board.getViewCount());

        return responseDTO;
    }
}
