package com.sports.Security;

import com.sports.user.UserDTO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AuthResponse {
    private String username;
    private String nickname;
    private String role;
    private String accessToken;
    private String refreshToken;
    private String errorMessage;

    // 기본적인 생성자 (에러 메세지 제외)
    public AuthResponse(String username, String nickname, String role, String accessToken, String refreshToken) {
    }

    // 에러 메세지만 보낼때
    public AuthResponse(String errorMessage) {
        this.errorMessage = errorMessage;
    }

}