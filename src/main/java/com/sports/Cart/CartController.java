package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.Item.ItemService;
import com.sports.Security.JwtTokenProvider;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final JwtTokenProvider jwtTokenProvider;
    private final CartService cartService;
    private final ItemService itemService;
    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<List<CartDTO>> getCartItems(@RequestHeader("Authorization") String token) {
        Long userId = Long.valueOf(jwtTokenProvider.extractUserId(token.replace("Bearer ", "")));
        List<CartDTO> cartItems = cartService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @RequestParam("cartCount") Integer count,
            @RequestParam("itemId") Long itemId,
            @RequestHeader("Authorization") String token) {

        String username = jwtTokenProvider.extractUserId(token.replace("Bearer ", ""));

        // 사용자 이름으로 User 객체를 찾고, User가 없으면 예외 발생
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Long userId = user.getId();

        CartDTO cartDTO = new CartDTO();
        cartDTO.setCount(count);
        Item item = itemService.findById(itemId);
        cartDTO.setItem(item);
        cartDTO.setUser(user);

        CartDTO addedCartItem = cartService.addCartItem(cartDTO, userId);
        return ResponseEntity.ok(addedCartItem);
    }

}

