package com.sports.Security;

import com.sports.Item.S3Service;
import com.sports.user.User;
import com.sports.user.UserDTO;
import com.sports.user.UserService;
import jakarta.validation.Valid;
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
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final S3Service s3Service;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> signUp(@Valid @ModelAttribute UserDTO userDTO,
                                                      BindingResult bindingResult,
                                                      @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        // 유효성 검사 결과 처리
        if (bindingResult.hasErrors()) {
            Map<String, String> errorResponse = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errorResponse.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorResponse);
        }

        String phone = userDTO.getPhone().replaceAll("[^0-9]", ""); // 숫자 이외의 문자를 제거
        userDTO.setPhone(phone);

        String imgURL;
        // 파일이 null일 경우 S3Service를 통해 기본 이미지 URL 가져오기
        if (file != null && !file.isEmpty()) {
            imgURL = s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());
        } else {
            imgURL = s3Service.saveFile(null, null); // 기본 이미지 URL을 가져옴
        }
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

    // 로그인
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

            // 유저 정보 가져오기
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Optional<User> optionalUser = userService.findByUsername(userDetails.getUsername());

            // User 객체 가져오기
            User user = optionalUser.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // 유저 정보를 담는 Map 생성
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("nickname", user.getNickname());
            userMap.put("phone", user.getPhone());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());
            userMap.put("address", user.getAddress());
            userMap.put("imgURL", user.getImgURL());
            userMap.put("provider", user.getProvider());
            userMap.put("providerId", user.getProviderId());
            userMap.put("createDate", user.getCreateDate());

            // 응답 Map 생성
            Map<String, Object> response = new HashMap<>();
            response.put("user", userMap);
            response.put("token", token);

            System.out.println("응답: " + response);
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            // 로그인 실패 시 로그 추가
            System.out.println("로그인 실패: 잘못된 ID 또는 비밀번호 입니다.");

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