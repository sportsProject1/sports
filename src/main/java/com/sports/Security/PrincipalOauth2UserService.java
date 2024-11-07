package com.sports.Security;

import com.sports.user.User;
import com.sports.user.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final HttpServletResponse response;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = provider.equals("google")
                ? oAuth2User.getAttribute("sub").toString()
                : oAuth2User.getAttribute("id").toString();
        String email = oAuth2User.getAttribute("email");

        Map<String, Object> properties = oAuth2User.getAttribute("properties");
        String nickname = (String) properties.get("nickname");
        String profileImageUrl = (String) properties.get("profile_image");

        String username = provider + "_" + providerId;
        String role = "ROLE_USER";

        User userEntity = userRepository.findByEmail(email).orElseGet(() -> {
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
        });

        // Redirect to client after successful OAuth2 login
        try {
            response.sendRedirect("http://localhost:3000/oauth2/redirect");
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new PrincipalUserDetails(userEntity, oAuth2User.getAttributes());
    }
}