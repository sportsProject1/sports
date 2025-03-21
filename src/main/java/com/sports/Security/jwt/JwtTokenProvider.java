package com.sports.Security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey; // 비밀 키 객체
    private final long expirationMinutes; // 발급 만료 시간 (분)
    private final long refreshExpirationHours; // 리프레시 토큰 만료 시간 (시간)
    private final String issuer; // 발급자

    // 생성자에서 값을 주입받음
    public JwtTokenProvider(
            @Value("${jwt.expiration-minutes}") long expirationMinutes,
            @Value("${jwt.refresh-expiration-hours}") long refreshExpirationHours,
            @Value("${jwt.issuer}") String issuer,
            @Value("${jwt.secret.key}") String secretKeyString
    ) {
        this.expirationMinutes = expirationMinutes;
        this.refreshExpirationHours = refreshExpirationHours;
        this.issuer = issuer;
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes());
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

    // 토큰에서 userId 추출 (sub)
    public String extractUserId(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    // 토큰에서 username 추출 (claims)
    public String getUsername(String token) {
        return (String) Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .get("username");
    }

    // 토큰에서 role 추출 (claims)
    public String getRole(String token) {
        return (String) Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get("role");
    }

    // 토큰 유효성 확인
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("만료된 토큰입니다: " + e.getMessage());
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("유효하지 않은 토큰입니다: " + e.getMessage());
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