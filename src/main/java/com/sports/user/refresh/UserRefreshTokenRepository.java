package com.sports.user.refresh;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRefreshTokenRepository extends JpaRepository <UserRefreshToken, Long> {

    // refreshToken을 기준으로 UserRefreshToken 검색
    Optional<UserRefreshToken> findByRefreshToken(String refreshToken);

    void deleteByUserId(Long userId);
}