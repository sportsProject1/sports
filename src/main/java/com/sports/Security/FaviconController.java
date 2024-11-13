package com.sports.Security;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FaviconController {

    @GetMapping("/favicon.ico")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content 응답
    public void handleFaviconRequest() {
        // 아무 동작도 하지 않음
        // /favicon.ico 요청을 무시하기 위한 컨트롤러
    }
}