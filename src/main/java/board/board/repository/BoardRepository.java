package board.board.repository;

import board.board.domain.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<Board> findAll(Pageable pageable); //페이징 메서드

    //제목을 대소문자 구분 없이 검색할 수 있는 메서드
    Page<Board> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    List<Board> findByUserUsernameAndCreateTimeAfter(String username, LocalDateTime date);
    int countByUserUsernameAndCreateTimeAfter(String username, LocalDateTime date);
}
