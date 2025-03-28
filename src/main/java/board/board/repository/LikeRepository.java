package board.board.repository;

import board.board.domain.Board;
import board.board.domain.LikeEntity;
import board.board.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    Optional<LikeEntity> findByUserAndBoard(User user, Board board); //특정 유저가 특정 게시글을 좋아요 했는지 찾음
    long countByBoard(Board board); //특정 게시글의 좋아요 개수 셈
}

