package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.Item.ItemService;
import com.sports.Security.JwtTokenProvider;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<List<CartDTO>> getCartItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        List<CartDTO> cartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @RequestParam("cartCount") Integer count,
            @RequestParam("itemId") Long itemId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        CartDTO cartDTO = new CartDTO();
        cartDTO.setCount(count);
        Item item = itemService.findById(itemId);
        cartDTO.setItem(item);
        cartDTO.setUser(user);

        CartDTO addedCartItem = cartService.addCartItem(cartDTO, String.valueOf(user.getId()));
        return ResponseEntity.ok(addedCartItem);
    }


}

