package com.sports.Security;

import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import com.sports.Item.S3Service;
import com.sports.user.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRefreshTokenRepository userRefreshTokenRepository;

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
    public ResponseEntity<AuthResponse> login(@ModelAttribute LoginRequest loginRequest) {
        try {
            // 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            // 권한 정보 가져오기
            String role = authentication.getAuthorities().iterator().next().getAuthority();

            // 액세스 토큰과 리프레시 토큰 생성
            String accessToken = jwtTokenProvider.createToken(authentication.getName(), role);
            String refreshToken = jwtTokenProvider.createRefreshToken();

            // 사용자 정보 추출
            User user = userService.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // 리프레시 토큰 저장 및 업데이트
            UserRefreshToken userRefreshToken = userRefreshTokenRepository.findById(user.getId())
                    .orElse(new UserRefreshToken(user, refreshToken));
            userRefreshToken.updateRefreshToken(refreshToken); // 기존 토큰이 있다면 업데이트
            userRefreshTokenRepository.save(userRefreshToken); // 새로 생성하거나 업데이트한 리프레시 토큰 저장

            // AuthResponse에 필요한 정보만 포함해 반환
            AuthResponse authResponse = new AuthResponse(
                    user.getUsername(),
                    user.getNickname(),
                    role,
                    accessToken,
                    refreshToken
            );
            return ResponseEntity.ok(authResponse);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        userService.findByUsername(username).ifPresent(user -> {
            userRefreshTokenRepository.deleteById(user.getId());  // DB에서 리프레시 토큰 삭제
        });

        return ResponseEntity.ok("로그아웃 되었습니다.");
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


}