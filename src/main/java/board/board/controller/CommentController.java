package board.board.controller;

import board.board.dto.CommentRequestDTO;
import board.board.dto.CommentResponseDTO;
import board.board.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/{boardId}/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /** Create: 댓글 작성 */
    @PostMapping
    public ResponseEntity<CommentResponseDTO> createComment(@PathVariable Long boardId,
                                                            @RequestBody CommentRequestDTO requestDTO) {
        CommentResponseDTO responseDTO = commentService.createComment(boardId, requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }



    /** Read: 댓글 조회 */
    //특정 게시판의 댓글 전체 목록 조회
    @GetMapping
    public ResponseEntity<List<CommentResponseDTO>> getAllCommentsByBoardId(@PathVariable Long boardId) {
       List<CommentResponseDTO> responseDTOs = commentService.getAllComments(boardId);

        return ResponseEntity.ok(responseDTOs);
    }

    //단일 댓글 조회
    @GetMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> getCommentById(@PathVariable Long boardId,
                                                             @PathVariable Long commentId) {
        CommentResponseDTO responseDTO = commentService.getCommentById(commentId);

        return ResponseEntity.ok(responseDTO);
    }


    /** Update: 댓글 수정 */
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable Long boardId,
                                                            @PathVariable Long commentId,
                                                            @RequestBody CommentRequestDTO requestDTO) {
        CommentResponseDTO responseDTO = commentService.updateComment(commentId, requestDTO);

        return ResponseEntity.ok(responseDTO);
    }


    /** Delete: 댓글 삭제 */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long boardId,
                                              @PathVariable Long commentId) {
        commentService.deleteComment(commentId);

        return ResponseEntity.noContent().build();
    }
}
