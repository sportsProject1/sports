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
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @PostConstruct
    public void init() {
        System.out.println("WebSocket Server is up and running!"); // 웹소켓 서버가 시작되었을 때 출력
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat/wss") // 엔드포인트 설정
                .setAllowedOriginPatterns("*") // CORS 설정
                .addInterceptors(new JwtHandshakeInterceptor(jwtTokenProvider))
                .withSockJS();

        logger.info("여기다 요가ㅣ /chat/ws");
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
            String authHeader = request.getHeaders().getFirst("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtTokenProvider.validateToken(token)) {
                    String userId = jwtTokenProvider.extractUserId(token);
                    attributes.put("userId", userId);
                    return true;
                }
            }
            return false;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception ex) {
            // 필요한 후속 작업 처리
        }
    }
}
