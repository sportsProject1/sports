package com.sports.Security;

import com.sports.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String username;
    private String nickname;
    private String role;
    private String accessToken;
    private String refreshToken;
}