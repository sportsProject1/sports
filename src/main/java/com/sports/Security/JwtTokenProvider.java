package com.sports.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private SecretKey secretKey; // 비밀 키 객체
    private final long expirationMinutes; // 발급 만료 시간 (분)
    private final long refreshExpirationHours; // 리프레시 토큰 만료 시간 (시간)
    private final String issuer; // 발급자

    // 생성자에서 값을 주입받음
    public JwtTokenProvider(
            @Value("${jwt.expiration-minutes}") long expirationMinutes,
            @Value("${jwt.refresh-expiration-hours}") long refreshExpirationHours,
            @Value("${jwt.issuer}") String issuer
    ) {
        this.expirationMinutes = expirationMinutes;
        this.refreshExpirationHours = refreshExpirationHours;
        this.issuer = issuer;
    }

    // secretKey 생성을 위한 PostConstruct 초기화
    @PostConstruct
    public void init() {
        // HS256에 맞는 안전한 비밀 키 생성
        this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    // JWT 토큰 생성
    public String createToken(Long userId, String username, String role) {
        Claims claims = Jwts.claims().setSubject(String.valueOf(userId)); // userId를 sub에 저장
        claims.put("username", username); // username을 claims에 추가
        claims.put("role", role);

        System.out.println("토큰에 포함된 권한 정보 확인: " + claims); // 토큰에 포함된 권한 정보 확인

        Date now = new Date();
        Date expiration = Date.from(Instant.now().plus(expirationMinutes, ChronoUnit.MINUTES));

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    // 토큰에서 userId (sub) 추출
    public String extractUserId(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    // 토큰에서 username 추출
    public String getUsername(String token) {
        return (String) Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .get("username"); // username을 claims에서 추출
    }

    // 토큰에서 role 추출
    public String getRole(String token) {
        return (String) Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get("role");
    }

    // 토큰 유효성 확인
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 리프레시 토큰 생성
    public String createRefreshToken() {
        return Jwts.builder()
                .setIssuer(issuer)
                .setIssuedAt(new Date())
                .setExpiration(Date.from(Instant.now().plus(refreshExpirationHours, ChronoUnit.HOURS)))
                .signWith(secretKey)
                .compact();
    }
}