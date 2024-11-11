package com.sports.user.controller;

import com.sports.Item.S3Service;
import com.sports.user.entito.User;
import com.sports.user.entito.UserDTO;
import com.sports.user.repository.ValidationGroups;
import com.sports.user.service.UserContextService;
import com.sports.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final S3Service s3Service;
    private final UserContextService userContextService;

    // 마이페이지에 띄울 유저정보 보내기
    @GetMapping("/mypage")
    public ResponseEntity<UserDTO> getUserPageInfo(Authentication authentication) {
        String username = authentication.getName(); // 현재 인증된 사용자의 username 가져오기
        User user = userContextService.findByUsername(username); // 가져온 username으로 유저테이블에서 조회

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO); // 객체복사
        return ResponseEntity.ok(userDTO); // 유저 정보를 UserDTO로 변환하여 클라이언트에 전달
    }

    // 마이페이지 수정
    @PutMapping("/update")
    public ResponseEntity<UserDTO> updateUser(@Validated(ValidationGroups.Update.class) @ModelAttribute UserDTO userDTO,
                                              @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        UserDTO updatedUserDTO = userService.updateUser(userDTO, file);

        return ResponseEntity.ok(updatedUserDTO);
    }


}