package com.sports.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private final JwtTokenProvider jwtTokenProvider;

    // JwtTokenProvider 주입을 받는 생성자
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Authorization 헤더에서 토큰 추출
        String token = resolveToken(request);

        // 토큰 유효성 검증 후 (Long)userId와 권한 추출
        if (token != null) {
            if (jwtTokenProvider.validateToken(token)) {
            Long userId = Long.parseLong(jwtTokenProvider.extractUserId(token)); // userId 추출
            String role = jwtTokenProvider.getRole(token);

            // userId와 권한을 포함한 인증 객체 생성
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userId, null, List.of(new SimpleGrantedAuthority(role))
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            // 토큰이 유효하지 않은 경우 401 응답 반환
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token.");
            return; // 필터 체인 진행을 중단하고 401 응답 전송
        }
    }
    filterChain.doFilter(request, response);
}

    // HTTP 요청에서 Authorization 헤더를 파싱하여 Bearer 토큰을 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 부분을 제거하고 반환
        }
        return null;
    }
}