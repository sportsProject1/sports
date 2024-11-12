package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.Item.ItemService;

import com.sports.user.entito.User;
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
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 장바구니 항목 추가
    public CartDTO addCartItem(CartDTO cartDTO, Long userId) {
        // Item을 cartDTO에서 가져오고, 이미 존재하는지 체크
        Item item = itemService.findById(cartDTO.getItem().getId());

        // 1. 동일한 상품이 이미 장바구니에 있는지 확인 (결제 상태가 false인 항목만)
        Cart existingCart = cartRepository.findByUserIdAndItemAndPaymentStatusFalse(userId, item);

        if (existingCart != null) {
            // 2. 이미 장바구니에 같은 상품이 존재하면 수량을 증가시킴
            existingCart.setCount(existingCart.getCount() + cartDTO.getCount());
            cartRepository.save(existingCart);  // 장바구니 항목 업데이트
            return convertToDto(existingCart);  // 업데이트된 장바구니 항목 반환
        }

        // 3. 상품이 존재하지 않으면 새 항목을 추가
        Cart cart = new Cart();
        cart.setCount(cartDTO.getCount());
        cart.setItem(item);
        cart.setUserId(userId);  // userId 설정
        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);  // 새로 추가된 장바구니 항목 반환
    }


    // 수량 업데이트 메서드
    public void updateCount(Long id, Integer count, Long userId) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("장바구니 항목을 찾을 수 없습니다."));

        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 수량 업데이트
        cart.setCount(count);
        cartRepository.save(cart);
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
    public void deleteCartItem(Long itemId, Long userId) {
        Cart cart = cartRepository.findById(itemId)
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

    // 사용자의 결제되지 않고 체크된 장바구니 항목들을 반환
    public List<Cart> getAvailableCartEntities(Long userId) {
        return cartRepository.findByUserIdAndIsCheckedAndPaymentStatus(userId, true, false);
    }

    public void saveAll(List<Cart> carts) {
        cartRepository.saveAll(carts);
    }

    // Cart 엔티티 -> DTO 변환
    public CartDTO convertToDto(Cart cart) {
        return new CartDTO(
                cart.getId(),
                cart.getCount(),
                cart.getItem(),
                cart.getUserId(),
                cart.isPaymentStatus(),
                cart.isChecked()
        );
    }
}

