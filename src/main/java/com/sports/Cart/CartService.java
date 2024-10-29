package com.sports.Cart;

import com.sports.Item.ItemDTO;
import com.sports.Item.ItemService;
import com.sports.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

//    public List<CartDTO> getCartItemsByUserId(String userId) {
//        List<Cart> cartItems = cartRepository.findByUserId(userId);
//
//        return cartItems.stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//    }
//
//    private CartDTO convertToDto(Cart cart) {
//        return CartDTO.builder()
//                .id(cart.getId())
//                .itemId(cart.getItem().getId())
//                .quantity(cart.getQuantity())
//                .userId(cart.getUser().getId())
//                .build();
//    }
}


