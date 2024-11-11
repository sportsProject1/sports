package com.sports.Security.jwt;

import com.sports.Security.auth.PrincipalUserDetails;
import com.sports.Security.auth.PrincipalUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final PrincipalUserDetailsService principalUserDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, PrincipalUserDetailsService principalUserDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.principalUserDetailsService = principalUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Authorization 헤더에서 토큰 추출
        String token = resolveToken(request);
        System.out.println("토큰 값 확인: " + token); // 토큰 값 확인

        // 토큰 유효성 검증
        if (token != null) {
            boolean isValid = jwtTokenProvider.validateToken(token);
            System.out.println("토큰 유효성 확인: " + isValid); // 토큰 유효성 확인 로그

            if (isValid) {
                String username = jwtTokenProvider.getUsername(token);
                System.out.println("사용자 이름 확인: " + username); // 사용자 이름 확인

                PrincipalUserDetails userDetails = (PrincipalUserDetails) principalUserDetailsService.loadUserByUsername(username);
                System.out.println("권한 정보 확인: " + userDetails.getAuthorities()); // 권한 정보 확인

                // 인증 객체 생성 및 SecurityContextHolder에 설정
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("인증 객체 확인: " + SecurityContextHolder.getContext().getAuthentication()); // 인증 객체 확인

            } else {
                // 토큰이 만료되었거나 유효하지 않은 경우 401 응답 반환
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token.");
                System.out.println("토큰 검증 실패: 만료되었거나 유효하지 않은 토큰."); // 토큰 검증 실패 로그
                return; // 필터 체인 중단하고 401 응답 전송
            }
        } else {
            System.out.println("토큰이 null입니다."); // 토큰이 없는 경우 로그
        }

        // 필터 체인 진행
        filterChain.doFilter(request, response);
    }


    // HTTP 요청에서 Authorization 헤더를 파싱하여 Bearer 토큰을 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        System.out.println("Authorization 헤더 확인: " + bearerToken); // Authorization 헤더 확인 로그

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 부분을 제거하고 반환
        }
        return null;
    }

}