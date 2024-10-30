package com.sports.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRefreshTokenRepository extends JpaRepository <UserRefreshToken, Long> {

    void deleteByUserId(Long userId);
}