package board.board.dto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class UserResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String nickname;
    private LocalDateTime createTime;
}
