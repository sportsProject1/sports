package com.sports.user.service;

import com.sports.Security.jwt.JwtTokenProvider;
import com.sports.Security.auth.PrincipalUserDetails;
import com.sports.user.refresh.UserRefreshToken;
import com.sports.user.refresh.UserRefreshTokenRepository;
import com.sports.user.repository.UserRepository;
import com.sports.user.entito.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserContextService {

    private final UserRepository userRepository;

    // 현재 인증된 사용자를 기준으로 User 객체 뽑기
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof PrincipalUserDetails)) {
            throw new RuntimeException("현재 인증된 사용자가 없습니다.");
        }
        PrincipalUserDetails userDetails = (PrincipalUserDetails) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    // 통합 로그아웃 서비스
    public void logout(Long userId, UserRefreshTokenRepository userRefreshTokenRepository) {
        userRefreshTokenRepository.deleteByUserId(userId);
        SecurityContextHolder.clearContext();
    }

    // username을 받아 User 조회
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }

    // userId를 받아 조회 (String 타입)
    public User findById(String userId) {
        return userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    // userId를 받아 조회 (Long 타입)
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    // 리프레시 토큰 갱신 서비스
    public String refreshAccessToken(String refreshToken, JwtTokenProvider jwtTokenProvider,
                                     UserRefreshTokenRepository userRefreshTokenRepository) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 리프레시 토큰입니다.");
        }

        UserRefreshToken userRefreshToken = userRefreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 리프레시 토큰입니다."));
        User user = userRefreshToken.getUser();
        return jwtTokenProvider.createToken(user.getId(), user.getUsername(), user.getRole());
    }
}
