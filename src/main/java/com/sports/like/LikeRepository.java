package com.sports.like;

import com.sports.user.entito.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    // 특정 유저와 대상에 대한 좋아요 여부 확인
    Optional<Like> findByUserAndTargetIdAndTargetType(User user, Long targetId, String targetType);

    // 특정 대상의 모든 좋아요 조회
    long countByTargetIdAndTargetType(Long targetId, String targetType);
}
