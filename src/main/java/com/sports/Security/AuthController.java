package com.sports.Security;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import com.sports.Item.S3Service;
import com.sports.Security.jwt.AuthResponse;
import com.sports.Security.jwt.JwtTokenProvider;
import com.sports.Security.jwt.LoginRequest;
import com.sports.user.User;
import com.sports.user.UserDTO;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.Principal;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 사용자 이름과 비밀번호를 이용해 인증을 시도
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(authentication.getName(), authentication.getAuthorities().toString());

        // 클라이언트에 JWT 전달
        return ResponseEntity.ok(new AuthResponse(token));
    }

//  프론트단으로 사용자정보 넘겨주는 메서드
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