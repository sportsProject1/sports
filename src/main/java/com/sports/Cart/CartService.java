package com.sports.Cart;

import com.sports.Cart.DTO.CartDTO;
import com.sports.Item.Item;
import com.sports.Item.ItemService;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserContextService userContextService;
    private final ItemService itemService;

    // 장바구니 항목 조회 (사용자 아이디로)
    public List<CartDTO> getCartItemsByUserId(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        return cartItems.stream()
                .filter(cart -> !cart.getItem().isDeleted())  // 삭제되지 않은 아이템만 필터링
                .filter(cart -> !cart.isPaymentStatus())  // 결제되지 않은 아이템만 필터링
                .map(this::convertToDto)  // CartDTO로 변환하여 반환
                .collect(Collectors.toList());
    }

    // 장바구니 항목 추가
    public CartDTO addCartItem(CartDTO cartDTO) {
        Long currentUserId = userContextService.getCurrentUserId(); // 로그인된 사용자 ID 가져오기
        Item item = itemService.findById(cartDTO.getItemId());  // itemId로 아이템을 찾기

        // 이미 장바구니에 존재하는 아이템인지 확인
        Cart existingCart = cartRepository.findByUserIdAndItemAndPaymentStatusFalse(currentUserId, item);
        if (existingCart != null) {
            existingCart.setCount(existingCart.getCount() + cartDTO.getCount());
            cartRepository.save(existingCart);
            return convertToDto(existingCart);
        }

        // 새 항목 추가
        Cart cart = new Cart();
        cart.setCount(cartDTO.getCount());
        cart.setItem(item);
        cart.setUserId(currentUserId);

        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    // 수량 업데이트 메서드
    public CartDTO updateCount(Long id, Integer count, Long userId) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("장바구니 항목을 찾을 수 없습니다."));

        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 수량 업데이트
        cart.setCount(count);
        Cart updatedCart = cartRepository.save(cart);
        return convertToDto(updatedCart);
    }

    // 체크박스 상태 업데이트 메서드
    public void updateIsChecked(Long id, boolean isChecked, Long userId) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("장바구니 항목을 찾을 수 없습니다."));

        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 체크 상태 업데이트
        cart.setChecked(isChecked);
        cartRepository.save(cart);
    }

    // 장바구니 항목 삭제
    public void deleteCartItem(Long cartId, Long userId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("장바구니 항목을 찾을 수 없습니다."));

        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 항목 삭제
        cartRepository.delete(cart);
    }

    // 체크된 항목 삭제
    public void deleteCheckedItems(Long userId) {
        List<Cart> checkedItems = cartRepository.findByUserIdAndIsChecked(userId, true);

        if (checkedItems.isEmpty()) {
            throw new RuntimeException("삭제할 체크된 항목이 없습니다.");
        }

        // 권한 확인 후 삭제
        for (Cart cart : checkedItems) {
            if (!cart.getUserId().equals(userId)) {
                throw new RuntimeException("권한이 없습니다.");
            }
        }

        cartRepository.deleteAll(checkedItems);
    }

    // 장바구니에서 결제되지 않은 항목 조회
    public List<CartDTO> getAvailableCartItems(Long userId) {
        List<Cart> availableItems = cartRepository.findByUserIdAndIsCheckedAndPaymentStatus(userId, true, false);
        return availableItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Cart 엔티티 -> DTO 변환
    public CartDTO convertToDto(Cart cart) {
        Item item = cart.getItem();
        return new CartDTO(
                cart.getId(),
                cart.getCount(),
                item.getId(),
                item.getTitle(),
                item.getPrice(),
                item.getImgurl(),
                cart.getUserId(),
                cart.isPaymentStatus(),
                cart.isChecked()
        );
    }
}