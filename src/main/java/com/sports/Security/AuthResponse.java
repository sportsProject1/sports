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
}