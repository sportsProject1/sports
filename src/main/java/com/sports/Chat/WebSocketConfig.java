package com.sports.Chat;

import com.sports.Security.jwt.JwtTokenProvider;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트가 구독하는 경로
        config.enableSimpleBroker("/topic", "/queue");
        // 클라이언트가 메시지를 보낼 때 사용하는 경로
        config.setApplicationDestinationPrefixes("/app");
        logger.info("MessageBroker 설정 완료: /topic, /queue");
    }

    @PostConstruct
    public void init() {
        logger.info("WebSocket Server is up and running!"); // 서버 시작 로그
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat/wss") // 엔드포인트 설정
                .setAllowedOriginPatterns("*") // CORS 허용
                .addInterceptors(new JwtHandshakeInterceptor(jwtTokenProvider)) // JWT 인터셉터 추가
                .withSockJS(); // SockJS 지원
        logger.info("Stomp 엔드포인트 등록: /chat/wss");
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
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                       WebSocketHandler wsHandler, Map<String, Object> attributes) {
            String authHeader = request.getHeaders().getFirst("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtTokenProvider.validateToken(token)) {
                    String userId = jwtTokenProvider.extractUserId(token);
                    attributes.put("userId", userId); // WebSocket 세션에 사용자 정보 저장
                    logger.info("WebSocket 핸드셰이크 성공: userId={}", userId);
                    return true;
                } else {
                    logger.warn("WebSocket 핸드셰이크 실패: 유효하지 않은 토큰");
                }
            } else {
                logger.warn("WebSocket 핸드셰이크 실패: Authorization 헤더 누락");
            }
            return false;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Exception ex) {
            logger.info("WebSocket 핸드셰이크 완료");
        }
    }
}
