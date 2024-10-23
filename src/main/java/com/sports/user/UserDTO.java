package com.sports.user;

import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String nickname;
    private int phone;
    private String email;
    private String address;
}
