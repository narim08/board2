package board.board.service;

import board.board.domain.Board;
import board.board.domain.User;
import board.board.dto.UserRequestDTO;
import board.board.dto.UserResponseDTO;
import board.board.repository.BoardRepository;
import board.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor //final 변수를 자동 생성자 주입해줌
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BoardRepository boardRepository;

    /* 회원가입 */
    @Transactional
    public UserResponseDTO register(UserRequestDTO requestDTO) {
        // Check if username already exists
        if (userRepository.existsByUsername(requestDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(requestDTO.getUsername());
        user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        user.setEmail(requestDTO.getEmail());
        user.setNickname(requestDTO.getNickname());
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return convertToResponseDTO(savedUser);
    }

    /* 로그인 */
    public UserResponseDTO login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return convertToResponseDTO(user);
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setId(user.getId());
        responseDTO.setUsername(user.getUsername());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setNickname(user.getNickname());
        responseDTO.setCreateTime(user.getCreateTime());
        return responseDTO;
    }

    // 최근 7일간의 사용자 게시글 조회수 통계 조회
    public List<Map<String, Object>> getRecentViewStats(String username) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Board> userBoards = boardRepository.findByUserUsernameAndCreateTimeAfter(username, sevenDaysAgo);

        // 날짜별로 조회수 합계 계산
        Map<LocalDate, Integer> dailyViews = new HashMap<>();
        for (Board board : userBoards) {
            LocalDate date = board.getCreateTime().toLocalDate();
            dailyViews.put(date, dailyViews.getOrDefault(date, 0) + board.getViewCount());
        }

        // 결과를 포맷팅
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String formattedDate = date.format(DateTimeFormatter.ofPattern("M/d"));
            int views = dailyViews.getOrDefault(date, 0);

            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", formattedDate);
            dayData.put("views", views);
            result.add(dayData);
        }

        return result;
    }

    // 최근 7일간의 사용자 게시글 작성 통계 조회
    public List<Map<String, Object>> getRecentPostStats(String username) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Board> userBoards = boardRepository.findByUserUsernameAndCreateTimeAfter(username, sevenDaysAgo);

        // 날짜별로 게시글 수 계산
        Map<LocalDate, Integer> dailyPosts = new HashMap<>();
        for (Board board : userBoards) {
            LocalDate date = board.getCreateTime().toLocalDate();
            dailyPosts.put(date, dailyPosts.getOrDefault(date, 0) + 1);
        }

        // 결과를 포맷팅
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String formattedDate = date.format(DateTimeFormatter.ofPattern("M/d"));
            int posts = dailyPosts.getOrDefault(date, 0);

            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", formattedDate);
            dayData.put("posts", posts);
            result.add(dayData);
        }

        return result;
    }

    // 이번 달과 이번 주의 게시글 작성 목표 진행률
    public Map<String, Object> getPostGoalProgress(String username) {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY).atStartOfDay();

        int monthlyPosts = boardRepository.countByUserUsernameAndCreateTimeAfter(username, startOfMonth);
        int weeklyPosts = boardRepository.countByUserUsernameAndCreateTimeAfter(username, startOfWeek);

        // 목표치 (실제로는 사용자 설정값을 사용할 수 있음)
        int monthlyGoal = 30;
        int weeklyGoal = 7;

        Map<String, Object> result = new HashMap<>();
        result.put("monthlyPosts", monthlyPosts);
        result.put("monthlyGoal", monthlyGoal);
        result.put("monthlyPercentage", Math.min(100, (int)(monthlyPosts * 100.0 / monthlyGoal)));

        result.put("weeklyPosts", weeklyPosts);
        result.put("weeklyGoal", weeklyGoal);
        result.put("weeklyPercentage", Math.min(100, (int)(weeklyPosts * 100.0 / weeklyGoal)));

        return result;
    }
}
