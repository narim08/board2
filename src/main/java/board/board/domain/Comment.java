package board.board.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter     //Lombok 라이브러리
@NoArgsConstructor  //기본 생성자 자동 생성해줌
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //테이블 고유 id

    @ManyToOne(fetch = FetchType.LAZY) // N:1 관계면 무조건 지연로딩 설정
    @JoinColumn(name = "post_id", nullable = false) // 조인해서 가져온 외래 키
    private Board board;

    @Column(nullable = false, length = 100) // NOT NULL, 최대 길이 100자
    private String userName;

    @Column(nullable = false, columnDefinition = "TEXT") // NOT NULL, TEXT 타입
    private String content;

    @Column(nullable = false, updatable = false) // 생성 시간, 수정 불가
    private LocalDateTime createTime;

    @Column(nullable = false) // 수정 시간
    private LocalDateTime updateTime;
}
