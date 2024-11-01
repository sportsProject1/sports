package com.sports.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public String register(UserDTO userDTO) {
        boolean isUser = userRepository.existsByUsername(userDTO.getUsername());
        if (isUser) {
            return "이미 존재하는 사용자입니다";
        }
        try {
        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());

        User user = User.builder()
                .username(userDTO.getUsername())
                .password(encodedPassword)
                .nickname(userDTO.getNickname())
                .phone(userDTO.getPhone())
                .email(userDTO.getEmail())
                .address(userDTO.getAddress())
                .role("ROLE_USER")
                .imgURL(userDTO.getImgURL())
                .build();

        userRepository.save(user);
        return "회원가입이 성공적으로 완료되었습니다.";
    } catch (Exception e) {
        return "회원가입중 오류가 발생했습니다: " + e.getMessage();
        }
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }

    // String 타입으로 userId를 받아 조회
    public User findById(String userId) {
        return userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    // Long 타입으로 userId를 받아 조회
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    // 유저정보 저장하고 유저객체 반환
    public User saveUser(User user) {
        return userRepository.save(user);
    }

}
