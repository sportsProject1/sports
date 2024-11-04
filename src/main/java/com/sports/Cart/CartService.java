package com.sports.Cart;

import com.sports.Interface.updatable;
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
public class CartService{

    private final CartRepository cartRepository;
    private final UserService userService;
    private final ItemService itemService;

    public List<CartDTO> getCartItemsByUserId(String userId) {
        Long id = Long.valueOf(userId);
        List<Cart> cartItems = cartRepository.findByUserId(id);

        return cartItems.stream()
                .filter(cart -> !cart.getItem().isDeleted()) // 삭제되지 않은 아이템만 필터링
                .filter(cart -> !cart.isPaymentStatus()) // 결제되지 않은 아이템만 필터링
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CartDTO addCartItem(CartDTO cartDTO, String userId) {
        Long id = Long.valueOf(userId);
        User user = userService.findById(String.valueOf(id));
        Item item = itemService.findById(cartDTO.getItem().getId());

        Cart cart = new Cart();
        cart.setCount(cartDTO.getCount());
        cart.setItem(item);
        cart.setUser(user);

        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    public void update(Long id, CartDTO dto, User user) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("장바구니 항목을 찾을 수 없습니다."));

        if (!cart.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 수량 업데이트
        if (dto.getCount() != null) {
            cart.setCount(dto.getCount());
        }

        // 체크 상태 업데이트
        cart.setChecked(dto.isChecked());

        cartRepository.save(cart);
    }

    public void deleteCheckedItems(User user) {
        List<Cart> checkedItems = cartRepository.findByUserAndIsChecked(user, true);

        for (Cart cart : checkedItems) {
            if (!cart.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("권한이 없습니다.");
            }
        }

        cartRepository.deleteAll(checkedItems);
    }

    private CartDTO convertToDto(Cart cart) {
        return new CartDTO(
                cart.getId(),
                cart.getCount(),
                cart.getItem(),
                cart.getUser(),
                cart.isPaymentStatus(),
                cart.isChecked()
        );
    }

    public List<CartDTO> getCheckedCartItems(User user) {
        List<Cart> checkedItems = cartRepository.findByUserAndIsChecked(user, true);
        return checkedItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<CartDTO> getAvailableCartItems(User user) {
        List<Cart> availableItems = cartRepository.findByUserAndIsCheckedAndPaymentStatus(user, true, false);
        return availableItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<Cart> getAvailableCartEntities(User user) {
        return cartRepository.findByUserAndIsCheckedAndPaymentStatus(user, true, false);
    }
}
