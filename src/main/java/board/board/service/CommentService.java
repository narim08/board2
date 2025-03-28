package board.board.service;

import board.board.domain.Board;
import board.board.domain.Comment;
import board.board.domain.User;
import board.board.dto.CommentRequestDTO;
import board.board.dto.CommentResponseDTO;
import board.board.repository.BoardRepository;
import board.board.repository.CommentRepository;
import board.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    /** Create: 댓글 작성 */
    /** Request: 작성자, 내용 */
    @Transactional
    public CommentResponseDTO createComment(String username, Long boardId, CommentRequestDTO requestDTO) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setBoard(board); //게시글과 댓글 연결
        comment.setUser(user); //유저와 댓글 연결
        comment.setContent(requestDTO.getContent());
        comment.setCreateTime(LocalDateTime.now());
        comment.setUpdateTime(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);
        return convertToResponseDTO(savedComment);
    }


    /** Read: 댓글 조회 */
    //특정 게시판의 댓글 전체 목록 조회
    public List<CommentResponseDTO> getAllComments(Long boardId) {
        return commentRepository.findByBoardId(boardId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    //단일 댓글 조회
    public CommentResponseDTO getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        return convertToResponseDTO(comment);
    }


    /** Update: 댓글 수정 */
    @Transactional
    public CommentResponseDTO updateComment(String username, Long commentId, CommentRequestDTO requestDTO) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        // Check if the user is the comment's owner
        if (!comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to update this comment");
        }

        comment.setContent(requestDTO.getContent());
        comment.setUpdateTime(LocalDateTime.now());

        return convertToResponseDTO(comment);
    }


    /** Delete: 댓글 삭제 */
    @Transactional
    public void deleteComment(String username, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()-> new RuntimeException("댓글을 찾을 수 없습니다."));

        // Check if the user is the comment's owner
        if (!comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }


    /** Response DTO 변환 */
    /** Response: id, 게시글id, 작성자, 내용, 생성일, 수정일 */
    private CommentResponseDTO convertToResponseDTO(Comment comment) {
        CommentResponseDTO responseDTO = new CommentResponseDTO();

        responseDTO.setId(comment.getId());
        responseDTO.setBoardId(comment.getBoard().getId());
        responseDTO.setUserName(comment.getUser().getUsername());
        responseDTO.setContent(comment.getContent());
        responseDTO.setCreateTime(comment.getCreateTime());
        responseDTO.setUpdateTime(comment.getUpdateTime());

        return responseDTO;
    }
}
