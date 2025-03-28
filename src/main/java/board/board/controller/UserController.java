package board.board.controller;

import board.board.dto.UserRegisterRequestDTO;
import board.board.dto.UserRegisterResponseDTO;
import board.board.dto.UserLoginRequestDTO;
import board.board.dto.UserLoginResponseDTO;
import board.board.domain.User;
import board.board.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 회원가입 API
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterRequestDTO request) {
        // 이미 존재하는 유저인지 확인
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "이미 존재하는 사용자입니다."));
        }

        // 비밀번호 암호화 후 저장
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setNickname(request.getNickname());
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        userRepository.save(user);

        // 응답 DTO 생성
        UserRegisterResponseDTO responseDTO = new UserRegisterResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getNickname()
        );

        return ResponseEntity.ok(responseDTO);
    }

    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequestDTO request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "존재하지 않는 사용자입니다."));
        }

        User user = userOptional.get();

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "비밀번호가 일치하지 않습니다."));
        }

        // 로그인 성공 응답 DTO 반환
        UserLoginResponseDTO responseDTO = new UserLoginResponseDTO(
                user.getUsername(),
                user.getNickname()
        );

        return ResponseEntity.ok(responseDTO);
    }
}


