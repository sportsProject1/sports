package com.sports.Security;

import com.sports.Item.S3Service;
import com.sports.user.UserDTO;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final S3Service s3Service;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

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

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@ModelAttribute LoginRequest loginRequest) {
        try {
        // 사용자 이름과 비밀번호를 이용해 인증을 시도
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(authentication.getName(),
                authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()).toString());
            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "로그인 성공");

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            // 로그 추가
            System.out.println("로그인 실패: 잘못된 사용자명 또는 비밀번호");

            // 에러 응답 구성
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid username or password");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/userinfo")
    public ResponseEntity<UserDTO> getUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // GrantedAuthority로부터 권한을 가져오기
                .findFirst() // 첫 번째 권한만 가져오기
                .orElse(null); // 권한이 없으면 null

        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(username);
        userDTO.setRole(role);

        return ResponseEntity.ok(userDTO);
    }


}