package com.sports.Security.auth.oauth2;

import com.sports.Security.auth.PrincipalUserDetails;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Autowired
    public PrincipalOauth2UserService(BCryptPasswordEncoder bCryptPasswordEncoder, UserRepository userRepository) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();  // ex) google, kakao
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

        // Step 1: providerId로 사용자 찾기
        User userEntity = userRepository.findByProviderId(providerId).orElse(null);

        // Step 2: providerId로 사용자가 없으면 email로 찾기
        if (userEntity == null) {
            User existingUser = userRepository.findByEmail(email).orElse(null);

            if (existingUser != null) {
                // 이메일이 일치하고, provider가 null인 경우 업데이트
                if (existingUser.getProvider() == null) {
                    existingUser.setProvider(provider);
                    existingUser.setProviderId(providerId);
                    userRepository.save(existingUser);
                    userEntity = existingUser;
                } else {
                    // 이메일이 일치하지만 provider가 다른 경우 새로운 계정 생성
                    userEntity = createUser(providerId, username, email, nickname, profileImageUrl, role, provider);
                }
            } else {
                // 이메일로도 사용자 없으면 새 사용자 생성
                userEntity = createUser(providerId, username, email, nickname, profileImageUrl, role, provider);
            }
        }
        // PrincipalUserDetails 생성
        PrincipalUserDetails userDetails = new PrincipalUserDetails(userEntity, oAuth2User.getAttributes());

        // 인증 정보 SecurityContext에 수동 저장
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return userDetails;
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