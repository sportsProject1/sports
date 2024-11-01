package com.sports.Security;

import com.sports.Item.S3Service;
import com.sports.user.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
        // UserDTO의 필드에 대해 유효성 검사
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
            // loginRequest로 받은 아이디,비번을 AuthenticationManager에게 전달하여 인증 처리
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            // 인증된 사용자의 (첫번째) 권한 정보를 String으로 추출
            String role = authentication.getAuthorities().iterator().next().getAuthority();

            // 인증된 사용자 이름으로 찾아서 User 엔티티 객체 생성
            User user = userService.findByUsername(authentication.getName());

            // userId, username, role 전달해 액세스토큰 생성, 리프레시도 생성
            String accessToken = jwtTokenProvider.createToken(user.getId(), user.getUsername(), role);
            String refreshToken = jwtTokenProvider.createRefreshToken();

            // 리프레시 토큰 갱신 및 저장
            UserRefreshToken userRefreshToken = userRefreshTokenRepository.findById(user.getId())
                    .orElse(new UserRefreshToken(user, refreshToken)); // userId로 찾아서 기존토큰이 없다면 생성
            userRefreshToken.updateRefreshToken(refreshToken); // 기존토큰이 있으면 갱신
            userRefreshTokenRepository.save(userRefreshToken); // 새로 생성하거나 갱신한 리프레시 토큰 저장

            // AuthResponse에 필요한 정보만 포함해 클라이언트에 반환
            AuthResponse authResponse = new AuthResponse(
                    user.getUsername(),
                    user.getNickname(),
                    role,
                    accessToken,
                    refreshToken
            );
            return ResponseEntity.ok(authResponse);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("인증 실패:Id 또는 비밀번호 입력 오류"));
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<String> logout(HttpServletRequest request) {

        // SecurityContextHolder에서 현재 사용자 이름을 가져옴
        String username = SecurityContextHolder.getContext().getAuthentication().getName();


        // 사용자 이름을 기반으로 리프레시 토큰 삭제 -> 세션을 만료
        User user = userService.findByUsername(username);
        userRefreshTokenRepository.deleteByUserId(user.getId());

        // SecurityContext 초기화
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    // 리프레시 토큰으로 검증하여 새로운 액세스 토큰 생성
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        // 클라이언트가 요청으로 보낸 리프레시 토큰을 가져옴
        String refreshToken = request.get("refreshToken");

        // 리프레시 토큰이 없거나 빈 문자열인 경우 400 반환
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: 리프레시토큰 없음");
        }

        // 리프레시 토큰 유효성 확인
        if (jwtTokenProvider.validateToken(refreshToken.trim())) {
            // 받은 리프레시 토큰이 UserRefreshToken 테이블에 있는지 확인
            UserRefreshToken userRefreshToken = userRefreshTokenRepository.findByRefreshToken(refreshToken)
                    .orElseThrow(() -> new RuntimeException("유효하지 않은 리프레시 토큰입니다."));
            // 리프레시 토큰에 연결된 User 를 가져옴
            User user = userRefreshToken.getUser();
            // 새로운 액세스 토큰 생성 및 반환
            String newAccessToken = jwtTokenProvider.createToken(user.getId(), user.getUsername(), user.getRole());
            System.out.println("리프레시완료 새 액세스토큰 : " + newAccessToken);
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        }

        // 리프레시토큰 유효성 검사 실패시 401 반환
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시토큰 유효성 검사 실패");
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