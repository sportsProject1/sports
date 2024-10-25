package com.sports.User;

import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String nickname;
    private String phone;
    private String email;
    private String address;
    private String imgURL;
}
