package com.sports.Cart;

import com.sports.Item.ItemDTO;
import com.sports.Item.ItemService;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    //내용없음

}

