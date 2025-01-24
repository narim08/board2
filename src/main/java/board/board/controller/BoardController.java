package board.board.controller;

import board.board.dto.BoardRequestDTO;
import board.board.dto.BoardResponseDTO;
import board.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    /** Create: 게시글 작성 */
    @PostMapping
    public ResponseEntity<BoardResponseDTO> createBoard(@RequestBody BoardRequestDTO requestDTO) {
        BoardResponseDTO responseDTO = boardService.createBoard(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }


    /** Read: 게시글 조회 */
    //게시글 전체 목록 조회
    @GetMapping
    public ResponseEntity<Page<BoardResponseDTO>> getAllBoards(@PageableDefault(size = 5, sort = "createTime") Pageable pageable) {
        Page<BoardResponseDTO> boards = boardService.getAllBoards(pageable);

        return ResponseEntity.ok(boards);
    }

    //게시글 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> getBoardById(@PathVariable Long id) {
        BoardResponseDTO board = boardService.getBoardById(id);

        return ResponseEntity.ok(board);
    }

    //게시글 검색 조회 (제목)
    @GetMapping("/search")
    public ResponseEntity<Page<BoardResponseDTO>> searchBoards(@RequestParam(value = "title", required = false) String title,
                                                               @PageableDefault(size = 5, sort = "createTime") Pageable pageable) {
        Page<BoardResponseDTO> boards = boardService.searchBoardsByTitle(title, pageable);

        return ResponseEntity.ok(boards);
    }


    /** Update: 게시글 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> updateBoard(@PathVariable Long id,
                                                        @RequestBody BoardRequestDTO requestDTO) {
        BoardResponseDTO board = boardService.updateBoard(id, requestDTO);

        return ResponseEntity.ok(board);
    }


    /** Delete: 게시글 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);

        return ResponseEntity.noContent().build(); //본문 없는 응답 자동 생성 (200 ok만)
    }
}