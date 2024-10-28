package com.sports.Security;

import lombok.*;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class LoginResponse {
    private int id;
    private String username;
    private String nickname;
    private String phone;
    private String email;
    private String role;
    private String address;
    private String imgURL;
    private String provider;
    private String providerId;
    private Timestamp createDate;
    private String token;
}
