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
import jakarta.servlet.http.Cookie;

import java.io.IOException;

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

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = provider.equals("google")
                ? oAuth2User.getAttribute("sub").toString()
                : oAuth2User.getAttribute("id").toString();
        String email = oAuth2User.getAttribute("email");
        String username = provider + "_" + providerId;
        String role = "ROLE_USER";

        // 이메일을 기준으로 기존 사용자 여부를 확인
        User userEntity = userRepository.findByEmail(email).orElseGet(() -> {
            // 새로운 사용자: 자동 회원가입 처리
            System.out.println("새로운 사용자, 자동 회원가입 진행");
            User newUser = User.builder()
                    .username(username)
                    .password(bCryptPasswordEncoder.encode("OAUTH2_PASSWORD")) // 기본 비밀번호 설정
                    .email(email)
                    .role(role)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            return userRepository.save(newUser);
        });

        System.out.println("기존 사용자 또는 자동 회원가입된 사용자, 자동 로그인 진행");

        // JWT 생성 및 쿠키 저장
        Long userId = userEntity.getId();
        String accessToken = jwtTokenProvider.createToken(userId, userEntity.getUsername(), userEntity.getRole());
        String refreshToken = jwtTokenProvider.createRefreshToken();

        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        try {
            response.sendRedirect("http://localhost:3000/oauth2/redirect");
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new PrincipalUserDetails(userEntity, oAuth2User.getAttributes());
    }


}