package com.sports.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@CrossOrigin
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public RedirectView signUp(@RequestBody UserDTO userDTO) {
        String resultMessage = userService.register(userDTO);

        if ("회원가입이 성공적으로 완료되었습니다.".equals(resultMessage)) {
            return new RedirectView("/");
        } else {
            return new RedirectView("/register?error=true");
        }
    }
}