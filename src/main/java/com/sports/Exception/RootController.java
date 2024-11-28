package com.sports.Exception;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {
    @GetMapping("/hi")
    public String home() {
        return "하이! 스프링 부트 서버가 정상적으로 작동 중입니다!";
    }
}