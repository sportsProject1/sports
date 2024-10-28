package com.sports.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {
    @NotBlank
    @Size(min = 3, max = 20, message = "Id : 3자~20자 사이가 아님")
    private String username;

    @NotBlank
    @Size(min = 8, max = 20, message = "비밀번호 : 8자~20자 사이가 아님")
    private String password;

    @NotBlank
    @Size(min = 3, max = 20, message = "닉네임 : 3자~20자 사이가 아님")
    private String nickname;

    @NotBlank
    @Size(min = 10, max = 13, message = "전화번호 : 10자~13자 사이가 아님")
    private String phone;

    @NotBlank
    @Email
    private String email;

    //나중에 api 따와보는걸로...
    private String address;
    private String imgURL;
    private String role;
}
