package com.sports.user;

import com.sports.Item.S3Service;
import com.sports.Security.AuthResponse;
import com.sports.Security.JwtTokenProvider;
import com.sports.Security.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    @Lazy @Autowired
    private final BCryptPasswordEncoder passwordEncoder;
    private final S3Service s3Service;
    private final UserContextService userContextService;

    // 일반 회원가입 서비스
    public String register(UserDTO userDTO, MultipartFile file) throws IOException {

        String phone = userDTO.getPhone().replaceAll("[^0-9]", "");
        userDTO.setPhone(phone);

        String imgURL;
        if (file != null && !file.isEmpty()) {
            imgURL = s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());
        } else {
            imgURL = s3Service.saveFile(null, null);
        }
        userDTO.setImgURL(imgURL);

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        User user = User.builder()
                .username(userDTO.getUsername())
                .password(encodedPassword)
                .nickname(userDTO.getNickname())
                .phone(userDTO.getPhone())
                .email(userDTO.getEmail())
                .address(userDTO.getAddress())
                .role("ROLE_USER")
                .imgURL(imgURL)
                .build();

        userRepository.save(user);
        return "회원가입이 성공적으로 완료되었습니다.";
    }

    // 일반 로그인 서비스
    public AuthResponse authenticateUser(LoginRequest loginRequest, AuthenticationManager authenticationManager,
                                         JwtTokenProvider jwtTokenProvider, UserRefreshTokenRepository userRefreshTokenRepository) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        User user = userContextService.findByUsername(authentication.getName());
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String accessToken = jwtTokenProvider.createToken(user.getId(), user.getUsername(), role);
        String refreshToken = jwtTokenProvider.createRefreshToken();

        UserRefreshToken userRefreshToken = userRefreshTokenRepository.findById(user.getId())
                .orElse(new UserRefreshToken(user, refreshToken));
        userRefreshToken.updateRefreshToken(refreshToken);
        userRefreshTokenRepository.save(userRefreshToken);

        return new AuthResponse(user.getUsername(), user.getNickname(), role, accessToken, refreshToken);
    }


    // 오어스 로그인시 JWT토큰과 유저정보 반환하는 서비스
    public Map<String, Object> generateTokenResponseWithUser(Long userId, JwtTokenProvider jwtTokenProvider,
                                                             UserRefreshTokenRepository userRefreshTokenRepository) {
        // 영속성 컨텍스트에서 User 엔티티 가져오기
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        String accessToken = jwtTokenProvider.createToken(user.getId(), user.getUsername(), user.getRole());
        String refreshToken = jwtTokenProvider.createRefreshToken();

        // 리프레시 토큰 저장 또는 업데이트
        UserRefreshToken userRefreshToken = userRefreshTokenRepository.findById(user.getId())
                .orElse(new UserRefreshToken(user, refreshToken));
        userRefreshToken.updateRefreshToken(refreshToken);
        userRefreshTokenRepository.save(userRefreshToken);

        // 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("nickname", user.getNickname());
        userInfo.put("role", user.getRole());
        userInfo.put("username", user.getUsername());
        response.put("user", userInfo);

        return response;
    }


    // 아이디 중복 여부
    public boolean isUsernameDuplicate(String username) {
        return userRepository.existsByUsername(username);
    }

    // 유저정보 저장하고 유저객체 반환
    public User saveUser(User user) {
        return userRepository.save(user);
    }

}
