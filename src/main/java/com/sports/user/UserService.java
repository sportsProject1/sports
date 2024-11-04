package com.sports.user;

import com.sports.Item.S3Service;
import com.sports.Security.AuthResponse;
import com.sports.Security.JwtTokenProvider;
import com.sports.Security.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final S3Service s3Service;

    // 회원가입 서비스
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

    // 로그인 서비스
    public AuthResponse authenticateUser(LoginRequest loginRequest, AuthenticationManager authenticationManager,
                                         JwtTokenProvider jwtTokenProvider, UserRefreshTokenRepository userRefreshTokenRepository) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        User user = findByUsername(authentication.getName());
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String accessToken = jwtTokenProvider.createToken(user.getId(), user.getUsername(), role);
        String refreshToken = jwtTokenProvider.createRefreshToken();

        UserRefreshToken userRefreshToken = userRefreshTokenRepository.findById(user.getId())
                .orElse(new UserRefreshToken(user, refreshToken));
        userRefreshToken.updateRefreshToken(refreshToken);
        userRefreshTokenRepository.save(userRefreshToken);

        return new AuthResponse(user.getUsername(), user.getNickname(), role, accessToken, refreshToken);
    }

    // 로그아웃 서비스
    public void logout(String username, UserRefreshTokenRepository userRefreshTokenRepository) {
        User user = findByUsername(username);
        userRefreshTokenRepository.deleteByUserId(user.getId());
        SecurityContextHolder.clearContext();
    }

    // 리프레시 토큰 갱신 서비스
    public String refreshAccessToken(String refreshToken, JwtTokenProvider jwtTokenProvider,
                                     UserRefreshTokenRepository userRefreshTokenRepository) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 리프레시 토큰입니다.");
        }

        UserRefreshToken userRefreshToken = userRefreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 리프레시 토큰입니다."));
        User user = userRefreshToken.getUser();
        return jwtTokenProvider.createToken(user.getId(), user.getUsername(), user.getRole());
    }


    // username을 받아 User 조회
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }

    // userId를 받아 조회 (String 타입)
    public User findById(String userId) {
        return userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    // userId를 받아 조회 (Long 타입)
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    // 유저정보 저장하고 유저객체 반환
    public User saveUser(User user) {
        return userRepository.save(user);
    }

}
