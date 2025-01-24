package board.board.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CommentRequestDTO {

    //Comment API Request body: 작성자, 내용 필요
    private String userName;
    private String content;
}
