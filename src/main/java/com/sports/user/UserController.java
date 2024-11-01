package com.sports.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    // 마이페이지에 띄울 유저정보 보내기
    @GetMapping("/mypage")
    public ResponseEntity<UserDTO> getUserPageInfo(Authentication authentication) {
        String username = authentication.getName(); // 인증된 사용자의 username 가져오기
        System.out.println("어덴티케이션.겟네임 :" + username);
        User user = userService.findByUsername(username);

        UserDTO userDTO = new UserDTO(user.getId(), user.getUsername(), user.getNickname(), user.getPhone(), user.getEmail(), user.getAddress(), user.getImgURL(), user.getRole());
        return ResponseEntity.ok(userDTO); // (비번 null) 유저 정보를 UserDTO로 클라이언트에 전달
    }

//    @PutMapping("/update")
//    public ResponseEntity<UserDTO> updateUser(@Valid @RequestBody UserDTO userDTO, Authentication authentication) {
//
//        // 현재 사용자의 정보를 가져와 수정 권한 확인
//        User existingUser = userService.findByUsername(authentication.getName());
//
//        // 수정할 정보 업데이트 (필요한 필드만 업데이트)
//        existingUser.setNickname(userDTO.getNickname());
//        existingUser.setPhone(userDTO.getPhone());
//        existingUser.setEmail(userDTO.getEmail());
//        existingUser.setAddress(userDTO.getAddress());
//        existingUser.setImgURL(userDTO.getImgURL());
//
//         업데이트된 유저 정보를 저장
//        userService.saveUser(existingUser);
//
//        // UserDTO로 변환하여 응답
//        UserDTO updatedUserDTO = new UserDTO();
//        BeanUtils.copyProperties(existingUser, updatedUserDTO);
//
//        return ResponseEntity.ok(updatedUserDTO); // 업데이트된 유저 정보를 반환
//    }


}