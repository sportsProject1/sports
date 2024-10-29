package com.sports.Cart;

import com.sports.Security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final JwtTokenProvider jwtTokenProvider;
    private final CartService cartService;

    @GetMapping("")
    public ResponseEntity<List<CartDTO>> getCartItems(@RequestHeader("Authorization") String token) {
        Long userId = Long.valueOf(jwtTokenProvider.extractUserId(token.replace("Bearer ", "")));
        List<CartDTO> cartItems = cartService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(@RequestBody CartDTO cartDTO,
                                             @RequestHeader("Authorization") String token) {
        String userId = jwtTokenProvider.extractUserId(token.replace("Bearer ", ""));
        CartDTO addedCartItem = cartService.addCartItem(cartDTO, userId);

        return ResponseEntity.ok(addedCartItem);
    }
}

