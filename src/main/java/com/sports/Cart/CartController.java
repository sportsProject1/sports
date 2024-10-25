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
        ItemDTO itemDTO = itemService.getItemDetail(id); // 아이템 정보를 가져옴

        if (itemDTO != null) {
            Cart cart = new Cart();

            // 유저 정보 가져오기
//            cart.setUserId(로그인된 정보에서 가져오기); // 사용자 ID 설정
//            cart.setUsername(로그인된 정보에서 가져오기); // 사용자 이름 설정
            cart.setItem(itemService.getItemEntity(id)); // 아이템 엔티티 설정
            cart.setCount(count);

            cartService.addCart(cart); // 카트에 아이템 추가

            return ResponseEntity.ok(new CartDTO(cart)); // 카트 DTO로 반환
        } else {
            return ResponseEntity.notFound().build();
        }
    }




}

