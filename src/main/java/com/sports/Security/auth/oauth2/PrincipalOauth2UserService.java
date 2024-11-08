package com.sports.Security.auth.oauth2;

import com.sports.Security.auth.PrincipalUserDetails;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    @Lazy @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final HttpServletResponse response;

    @Autowired
    public PrincipalOauth2UserService(BCryptPasswordEncoder bCryptPasswordEncoder, UserRepository userRepository, HttpServletResponse response) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userRepository = userRepository;
        this.response = response;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId;
        String email;
        String nickname;
        String profileImageUrl;

        if ("google".equals(provider)) {
            // 구글 OAuth2 이메일, 닉네임, 프사 뽑아옴
            providerId = oAuth2User.getAttribute("sub").toString();
            email = oAuth2User.getAttribute("email");
            nickname = oAuth2User.getAttribute("name");  // 구글에서는 이름을 'name' 필드로 제공
            profileImageUrl = oAuth2User.getAttribute("picture");  // 프로필 이미지는 'picture' 필드로 제공
        } else if ("kakao".equals(provider)) {
            // 카카오 OAuth2 닉네임, 프사 뽑아옴
            providerId = oAuth2User.getAttribute("id").toString();
            Map<String, Object> properties = oAuth2User.getAttribute("properties");
            nickname = (String) properties.get("nickname");
            profileImageUrl = (String) properties.get("profile_image");
            // 카카오에서 이메일이 제공 될경우 (돈 내면ㅋ)
//            Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttribute("kakao_account");
//            if (kakaoAccount != null && kakaoAccount.get("email") != null) {
//                email = kakaoAccount.get("email").toString();
//            }
            email = "";
        } else {
            throw new OAuth2AuthenticationException("지원되지 않는 소셜 제공자입니다: " + provider);
        }

        String username = provider + "_" + providerId;
        String role = "ROLE_USER";

        User userEntity = (email != null && !email.isEmpty())
                ? userRepository.findByEmail(email).orElseGet(() -> createUser(providerId, username, email, nickname, profileImageUrl, role, provider))
                : userRepository.findByProviderId(providerId).orElseGet(() -> createUser(providerId, username, null, nickname, profileImageUrl, role, provider));

        // Redirect to client after successful OAuth2 login
        try {
            response.sendRedirect("http://localhost:3000/oauth2/redirect");
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new PrincipalUserDetails(userEntity, oAuth2User.getAttributes());
    }

    private User createUser(String providerId, String username, String email, String nickname, String profileImageUrl, String role, String provider) {
        User newUser = User.builder()
                .username(username)
                .password(bCryptPasswordEncoder.encode("OAUTH2_PASSWORD"))
                .nickname(nickname)
                .email(email)
                .role(role)
                .provider(provider)
                .providerId(providerId)
                .imgURL(profileImageUrl)
                .build();
        return userRepository.save(newUser);
    }
}