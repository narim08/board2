package board.board.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class CommentResponseDTO {

    //Comment API Response body: id, boardId, 작성자, 내용, 생성 날짜 필요
    private Long id;
    private Long boardId;
    private String userName;
    private String content;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
