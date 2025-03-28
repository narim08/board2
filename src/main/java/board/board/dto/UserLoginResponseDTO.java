package board.board.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginResponseDTO {
    private String username;
    private String nickname;

    public UserLoginResponseDTO(String username, String nickname) {
        this.username = username;
        this.nickname = nickname;
    }
}

