package com.sports.user;

import com.sports.Item.S3Service;
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
                                              Authentication authentication,
                                              @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        // 현재 사용자의 정보를 가져옴
        User existingUser = userContextService.findByUsername(authentication.getName());

        // userDTO의 값으로 기존 user 엔티티 업데이트
        existingUser.setNickname(userDTO.getNickname());
        existingUser.setPhone(userDTO.getPhone());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setAddress(userDTO.getAddress());

        // 이미지 파일 처리 로직
        if (file != null && !file.isEmpty()) {
            // 새로운 파일이 업로드된 경우 - 기존 URL과 비교
            String newImgURL = s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());

            // 기존 이미지 URL과 다를 때만 업데이트
            if (!newImgURL.equals(existingUser.getImgURL())) {
                existingUser.setImgURL(newImgURL);
            }
        }
        // 파일이 null일 경우 이미지를 업데이트하지 않음

        // 변경된 사용자 정보를 저장
        userService.saveUser(existingUser);

        // 변경된 엔티티를 DTO로 변환 후 반환
        UserDTO updatedUserDTO = new UserDTO();
        BeanUtils.copyProperties(existingUser, updatedUserDTO);

        return ResponseEntity.ok(updatedUserDTO); // 업데이트된 유저 정보를 DTO로 반환
    }


}