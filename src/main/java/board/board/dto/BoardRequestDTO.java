package board.board.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BoardRequestDTO {

    //Board API Request body: 제목, 작성자, 내용 필요
    private String title;
    private String userName;
    private String content;
}
