package com.sports.user;

import com.sports.Item.S3Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.BeanUtils;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final S3Service s3Service;

    // 마이페이지에 띄울 유저정보 보내기
    @GetMapping("/mypage")
    public ResponseEntity<UserDTO> getUserPageInfo(Authentication authentication) {
        String username = authentication.getName(); // 현재 인증된 사용자의 username 가져오기
        User user = userService.findByUsername(username); // 가져온 username으로 유저테이블에서 조회

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO); // 객체복사
        return ResponseEntity.ok(userDTO); // 유저 정보를 UserDTO로 변환하여 클라이언트에 전달
    }

    // 마이페이지 수정
    @PutMapping("/update")
    public ResponseEntity<UserDTO> updateUser(@Valid @ModelAttribute UserDTO userDTO,
                                              Authentication authentication,
                                              @RequestParam(value = "file", required = false) MultipartFile file) throws IOException, IllegalAccessException {

        // 현재 사용자의 정보를 가져와 수정 권한 확인
        User existingUser = userService.findByUsername(authentication.getName());

        // UserDTO에서 필드들을 가져와 기존 User 객체와 비교하여 다를 경우에만 업데이트
        for (Field field : UserDTO.class.getDeclaredFields()) {
            field.setAccessible(true);
            Object newValue = field.get(userDTO); // userDTO의 필드 값
            Object oldValue = ReflectionUtils.getField(field, existingUser); // 기존 User 객체의 필드 값

            // 새로운 값이 기존 값과 다를 경우에만 업데이트
            if (newValue != null && !newValue.equals(oldValue)) {
                ReflectionUtils.setField(field, existingUser, newValue);
            }
        }

        // imgURL 처리 로직
        String imgURL;
        if (file == null) {
            // 파일이 null이면 기본 이미지 URL을 가져옴
            imgURL = s3Service.saveFile(null, null);
        } else {
            // 파일이 null이 아니면 파일을 업로드하여 새로운 URL을 설정
            imgURL = s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());
        }
        existingUser.setImgURL(imgURL); // 최종 결정된 imgURL로 업데이트

        // 변경된 사용자 정보를 저장
        userService.saveUser(existingUser);

        // UserDTO로 변환하여 응답
        UserDTO updatedUserDTO = new UserDTO();
        BeanUtils.copyProperties(existingUser, updatedUserDTO);

        return ResponseEntity.ok(updatedUserDTO); // 업데이트된 유저 정보를 반환
    }


}