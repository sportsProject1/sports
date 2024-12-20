package com.sports.user.entito;

import com.sports.user.repository.ValidationGroups;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;

    @NotBlank(groups = ValidationGroups.Create.class)
    @Size(min = 6, max = 20, message = "Id : 6자~20자 사이가 아님")
    @Pattern(regexp = "^[a-zA-Z]+[a-zA-Z0-9]*$", message = "Id : 영어만 or 영어+숫자 조합만 허용")
    private String username;

    @NotBlank(groups = ValidationGroups.Create.class)
//    @Size(min = 8, max = 20, message = "비밀번호 : 8자~20자 사이가 아님")
//    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]*$", message = "비밀번호 : 영어+숫자 조합만 허용")
    private String password;

    @NotBlank
//    @Size(min = 2, max = 20, message = "이름 : 2자~20자 사이가 아님")
    private String nickname;
    //닉네임말고 이름

    @NotBlank
//    @Size(min = 10, max = 13, message = "전화번호 : 10자~13자 사이가 아님")
    private String phone;

    @NotBlank
    @Email
    private String email;
    private String role;

    //나중에 api 따와보는걸로...
    private String address;
    private String imgURL;

    // 마이페이지 유저 정보 보내기용 생성자
    public UserDTO(Long id, String username, String nickname, String phone, String email, String address, String imgURL, String role) {
        this.id = id;
        this.username = username;
        this.nickname = nickname;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.imgURL = imgURL;
        this.role = role;
    }

}
