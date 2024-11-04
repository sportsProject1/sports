package com.sports.Security;

import com.sports.user.UserDTO;
import com.sports.user.UserRefreshTokenRepository;
import com.sports.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRefreshTokenRepository userRefreshTokenRepository;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> signUp(@Valid @ModelAttribute UserDTO userDTO,
                                                      @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        String resultMessage = userService.register(userDTO, file);
        Map<String, String> response = Map.of("message", resultMessage);

        if ("회원가입이 성공적으로 완료되었습니다.".equals(resultMessage)) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@ModelAttribute LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = userService.authenticateUser(
                    loginRequest, authenticationManager, jwtTokenProvider, userRefreshTokenRepository);
            return ResponseEntity.ok(authResponse);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("인증 실패: Id 또는 비밀번호 입력 오류"));
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.logout(username, userRefreshTokenRepository);
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    // 리프레시 토큰으로 새로운 액세스 토큰 생성
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: 리프레시토큰 없음");
        }

        try {
            String newAccessToken = userService.refreshAccessToken(refreshToken.trim(), jwtTokenProvider, userRefreshTokenRepository);
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}



//    @GetMapping("/userinfo")
//    public ResponseEntity<UserDTO> getUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
//        String username = userDetails.getUsername();
//        String role = userDetails.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority) // GrantedAuthority로부터 권한을 가져오기
//                .findFirst() // 첫 번째 권한만 가져오기
//                .orElse(null); // 권한이 없으면 null
//
//        UserDTO userDTO = new UserDTO();
//        userDTO.setUsername(username);
//        userDTO.setRole(role);
//
//        return ResponseEntity.ok(userDTO);
//    }


