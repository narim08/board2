// UserStatsController.java
package board.board.controller;

import board.board.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/stats")
@RequiredArgsConstructor
public class UserStatsController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserStats(@RequestHeader("Username") String username) {
        Map<String, Object> stats = new HashMap<>();

        // 조회수 통계
        List<Map<String, Object>> viewStats = userService.getRecentViewStats(username);
        stats.put("viewStats", viewStats);

        // 게시글 작성 통계
        List<Map<String, Object>> postStats = userService.getRecentPostStats(username);
        stats.put("postStats", postStats);

        // 목표 진행률
        Map<String, Object> goalProgress = userService.getPostGoalProgress(username);
        stats.put("goalProgress", goalProgress);

        return ResponseEntity.ok(stats);
    }
}