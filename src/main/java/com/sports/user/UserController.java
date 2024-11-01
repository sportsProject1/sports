package com.sports.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/mypage")
    public ResponseEntity<UserDTO> getUserPageInfo(Authentication authentication) {
        String username = authentication.getName(); // 인증된 사용자의 username 가져오기
        System.out.println("어덴티케이션.겟네임 :" + username);
        User user = userService.findByUsername(username);

        UserDTO userDTO = new UserDTO(user.getId(), user.getUsername(), user.getNickname(), user.getPhone(), user.getEmail(), user.getAddress(), user.getImgURL(), user.getRole());
        return ResponseEntity.ok(userDTO); // (비번만 빼고 다) 유저 정보를 UserDTO로 클라이언트에 전달
    }

//    @PutMapping("/user/update")
//    public ResponseEntity<?> updateUserInfo(@RequestBody UserDTO userDTO, Authentication authentication) {
//        // 인증된 사용자의 ID를 가져오기
//        String username = authentication.getName();
//        Optional<User> userOptional = userService.findByUsername(username);
//
//        if (userOptional.isPresent()) {
//            User user = userOptional.get();
//
//            // UserDTO에서 받은 데이터를 User 엔티티에 반영
//            user.setNickname(userDTO.getNickname());
//            user.setEmail(userDTO.getEmail());
//            user.setPhone(userDTO.getPhone());
//            user.setAddress(userDTO.getAddress());
//
//            // 업데이트 된 사용자 정보 저장
//            userService.save(user);
//
//            return ResponseEntity.ok("User information updated successfully");
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
//        }
//    }



}