package board.board.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String nickname;

    public UserRegisterResponseDTO(Long id, String username, String email, String nickname) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.nickname = nickname;
    }
}
