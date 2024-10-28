package com.sports.user;

import lombok.RequiredArgsConstructor;
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

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }


}
