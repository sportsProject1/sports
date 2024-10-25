package com.sports.Cart;

import com.sports.Item.ItemDTO;
import com.sports.Item.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final ItemService itemService;
    private final CartService cartService;
    private final CartRepository cartRepository;

    @PostMapping("/cart/add/{id}")
    public ResponseEntity<CartDTO> addItemToCart(@PathVariable Long id, @RequestParam Integer count) {
        ItemDTO itemDTO = itemService.getItemDetail(id);

        if (itemDTO != null) {
            Cart cart = new Cart();

            // 유저 정보 가져오기
//            cart.setUserId(로그인된 정보에서 가져오기);
//            cart.setUsername(로그인된 정보에서 가져오기);
            cart.setItem(itemService.getItemEntity(id));
            cart.setCount(count);

            cartService.addCart(cart);

            return ResponseEntity.ok(new CartDTO(cart));
        } else {
            return ResponseEntity.notFound().build();
        }
    }




}

