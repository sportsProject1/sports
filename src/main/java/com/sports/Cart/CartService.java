package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.Item.ItemService;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserService userService;
    private final ItemService itemService;

    public List<CartDTO> getCartItemsByUserId(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        return cartItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CartDTO addCartItem(CartDTO cartDTO, Long userId) {
        User user = userService.findById(userId);
        Item item = itemService.findById(cartDTO.getItem().getId());

        Cart cart = new Cart();
        cart.setCount(cartDTO.getCount());
        cart.setItem(item);
        cart.setUser(user);

        Cart savedCart = cartRepository.save(cart);

        return convertToDto(savedCart);
    }

    private CartDTO convertToDto(Cart cart) {
        return new CartDTO(
                cart.getId(),
                cart.getCount(),
                cart.getItem(),
                cart.getUser(),
                cart.isPaymentStatus()
        );
    }
}


