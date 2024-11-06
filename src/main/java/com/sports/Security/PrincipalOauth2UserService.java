package com.sports.Security;

import com.sports.user.User;
import com.sports.user.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final HttpServletResponse response;

    @Autowired
    public PrincipalOauth2UserService(@Lazy BCryptPasswordEncoder bCryptPasswordEncoder,
                                      UserRepository userRepository,
                                      JwtTokenProvider jwtTokenProvider,
                                      HttpServletResponse response) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.response = response;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // OAuth2 공급자 정보 가져오기
        String provider = userRequest.getClientRegistration().getRegistrationId(); // "google" 또는 "kakao"
        String providerId = (provider.equals("google")) ? oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
        String username = provider + "_" + providerId;
        String email = oAuth2User.getAttribute("email");
        String role = "ROLE_USER";

        // 사용자 데이터 확인 및 자동 회원가입
        User userEntity = userRepository.findByUsername(username)
                .orElseGet(() -> {
                    System.out.println("최초 로그인, 자동 회원가입 처리");
                    User newUser = User.builder()
                            .username(username)
                            .password(bCryptPasswordEncoder.encode("OAUTH2_PASSWORD"))
                            .email(email)
                            .role(role)
                            .provider(provider)
                            .providerId(providerId)
                            .build();
                    return userRepository.save(newUser);
                });

        // JWT 액세스 토큰 및 리프레시 토큰 생성
        Long userId = userEntity.getId();
        String accessToken = jwtTokenProvider.createToken(userId, userEntity.getUsername(), userEntity.getRole());
        String refreshToken = jwtTokenProvider.createRefreshToken();

        // JWT 액세스 및 리프레시 토큰을 응답 헤더에 추가
        response.addHeader("Authorization", "Bearer " + accessToken);
        response.addHeader("Refresh-Token", "Bearer " + refreshToken);

        return new PrincipalUserDetails(userEntity, oAuth2User.getAttributes());
    }
}