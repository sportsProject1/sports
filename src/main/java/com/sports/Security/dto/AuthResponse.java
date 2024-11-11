package com.sports.Security.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private String username;
    private String nickname;
    private String role;
    private String accessToken;
    private String refreshToken;
    private String errorMessage;

    // 기본적인 생성자 (에러 메세지 제외)
    public AuthResponse(String username, String nickname, String role, String accessToken, String refreshToken) {
        this.username = username;
        this.nickname = nickname;
        this.role = role;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    // 에러 메세지만 보낼때
    public AuthResponse(String errorMessage) {
        this.errorMessage = errorMessage;
    }

}