package com.sports.user;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String nickname;
    private String phone;
    private String email;
    private String address;
    private String imgURL;
    private String role;
}
