package com.sports.user.controller;

import com.sports.user.entito.User;
import com.sports.user.entito.UserDTO;
import com.sports.user.repository.UserRepository;
import com.sports.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/users")
public class RoleController {

    private final UserRepository userRepository;
    private final UserService userService;

    // 사용자 목록 조회
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll(); // DB에서 모든 사용자 가져오기
        return ResponseEntity.ok(users); // 사용자 목록 반환
    }

    // 사용자 권한 조회
    @GetMapping("/{id}/role")
    public String getUserRole(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getRole();
    }

    // 사용자 권한 수정
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        String newRole = request.get("role");
        if (!Arrays.asList("ROLE_USER", "ROLE_MANAGER", "ROLE_SELLER", "ROLE_ADMIN").contains(newRole)) {
            return ResponseEntity.badRequest().body("Invalid role");
        }

        user.setRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok("Role updated successfully");
    }

    // 검색(유저)
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String keyword) {
        List<UserDTO> searchResults = userService.searchBoardByEmail(keyword);
        return ResponseEntity.ok(searchResults);
    }

}
