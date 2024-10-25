package com.sports.security;

import com.sports.Item.S3Service;
import com.sports.user.User;
import com.sports.user.UserDTO;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequiredArgsConstructor
public class SecurityController {

    private final UserService userService;
    private final S3Service s3Service;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> signUp(@ModelAttribute UserDTO userDTO,
                                                      @RequestParam("file") MultipartFile file) throws IOException {
        String phone = userDTO.getPhone().replaceAll("[^0-9]", ""); // 숫자 이외의 문자를 제거
        userDTO.setPhone(phone);

        String imgURL = s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());
        userDTO.setImgURL(imgURL);

        String resultMessage = userService.register(userDTO);

        Map<String, String> response = new HashMap<>();
        response.put("message", resultMessage);

        if ("회원가입이 성공적으로 완료되었습니다.".equals(resultMessage)) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUserInfo(Principal principal) {
        User user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "사용자를 찾을 수 없습니다: " + principal.getName()
                ));

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO); // User에서 UserDTO로 속성 복사

        return ResponseEntity.ok(userDTO);
    }


}