package com.sports.Chat;

import com.sports.Security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider; // JwtTokenProvider 주입

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat/wss") // WebSocket 엔드포인트 설정
                .setAllowedOriginPatterns("*")
                .addInterceptors(new JwtHandshakeInterceptor(jwtTokenProvider)) // JwtHandshakeInterceptor 적용
                .withSockJS();
    }


    /**
     * WebSocket 연결 핸드셰이크 과정에서 토큰 검증을 처리하는 HandshakeInterceptor
     */
    private static class JwtHandshakeInterceptor implements HandshakeInterceptor {

        private final JwtTokenProvider jwtTokenProvider;

        public JwtHandshakeInterceptor(JwtTokenProvider jwtTokenProvider) {
            this.jwtTokenProvider = jwtTokenProvider;
        }

        @Override
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) {
            // 헤더에서 Authorization 추출
            String authHeader = request.getHeaders().getFirst("Authorization");

            System.out.println("Authorization header: " + authHeader); // 로그 추가

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                // 토큰 유효성 검증
                if (jwtTokenProvider.validateToken(token)) {
                    String userId = jwtTokenProvider.extractUserId(token);
                    attributes.put("userId", userId); // WebSocket 세션에 사용자 정보 저장
                    return true;
                } else {
                    System.out.println("Invalid JWT token");
                }
            } else {
                System.out.println("Authorization header is missing or invalid");
            }

            // 유효하지 않은 토큰인 경우 false 반환
            return false;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception ex) {
            // 핸드셰이크 이후 처리할 내용이 있으면 구현
        }
    }
}
