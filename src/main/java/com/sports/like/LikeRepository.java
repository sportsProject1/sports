package com.sports.like;

import com.sports.user.entito.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Likes, Long> {

    // 특정 유저와 대상에 대한 좋아요 여부 확인
    Optional<Likes> findByUserAndTargetIdAndTargetType(User user, Long targetId, String targetType);

    // 특정 대상의 모든 좋아요 조회
    long countByTargetIdAndTargetType(Long targetId, String targetType);

    // 여러 게시글의 좋아요 '수'를 한번에 조회
    @Query("SELECT l.targetId, COUNT(l) " +
            "FROM Likes l WHERE l.targetType = :targetType AND l.targetId IN :targetIds " +
            "GROUP BY l.targetId")
    Map<Long, Long> findLikeCounts(@Param("targetType") String targetType, @Param("targetIds") List<Long> targetIds);

    // 대상 id들을 기준으로 좋아요를 가져옴
    List<Likes> findByUserAndTargetIdInAndTargetType(User user, List<Long> targetIds, String targetType);

}
