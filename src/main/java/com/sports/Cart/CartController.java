package com.sports.Cart;

import com.sports.Item.ItemDTO;
import com.sports.Item.ItemService;
import com.sports.Security.JwtTokenProvider;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final JwtTokenProvider jwtTokenProvider;
    private final CartService cartService;

//    @GetMapping("")
//    public ResponseEntity<List<CartDTO>> getCartItems(@RequestHeader("Authorization") String token) {
//        String userId = jwtTokenProvider.extractUserId(token.replace("Bearer ", ""));
//        List<CartDTO> cartItems = cartService.getCartItemsByUserId(userId);
//        return ResponseEntity.ok(cartItems);
//    }
//
//    @PostMapping("/add")
//    public ResponseEntity<CartResponseDTO> addToCart(@RequestBody CartDTO cartDTO,
//                                                     @RequestHeader("Authorization") String token) {
//
//    }
}

