package com.sports.Cart;

import com.sports.Item.ItemDTO;
import com.sports.Item.ItemService;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final ItemService itemService;
    private final CartService cartService;
    private final CartRepository cartRepository;
    private final UserService userService;

    @PostMapping("/cart/add/{id}")
    public ResponseEntity<CartDTO> addItemToCart(@PathVariable Long id,
                                                 @RequestParam Integer count,
                                                 Authentication authentication) {

        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));

        ItemDTO itemDTO = itemService.getItemDetail(id);

        if (itemDTO != null) {
            Cart cart = new Cart();

            cart.setItem(itemService.getItemEntity(id));
            cart.setCount(count);

            cartService.addCart(cart);

            return ResponseEntity.ok(new CartDTO(cart));
        } else {
            return ResponseEntity.notFound().build();
        }
    }




}

