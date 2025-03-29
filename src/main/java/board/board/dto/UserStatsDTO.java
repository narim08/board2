// UserStatsDTO.java
package board.board.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter @Setter
public class UserStatsDTO {
    private int totalPosts;
    private int totalViews;
    private List<Map<String, Object>> dailyStats; // 날짜별 통계 데이터
}