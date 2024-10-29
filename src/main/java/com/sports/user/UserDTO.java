package com.sports.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;

    @NotBlank
    @Size(min = 6, max = 20, message = "Id : 6자~20자 사이가 아님")
    private String username;
    // 한글안들어오게

    @NotBlank
    @Size(min = 8, max = 20, message = "비밀번호 : 8자~20자 사이가 아님")
    private String password;
    //영어+숫자

    @NotBlank
    @Size(min = 2, max = 20, message = "이름 : 2자~20자 사이가 아님")
    private String nickname;
    //닉네임말고 이름


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
