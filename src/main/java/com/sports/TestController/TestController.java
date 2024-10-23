package com.sports.TestController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/")
    public @ResponseBody String index() {
        return "indeasdasdasdx";
    }

    @GetMapping("api/data")
    public String data() {
        return "리액트로 넘겨줄 데이터";
    }
}
