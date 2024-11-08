package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.Item.ItemService;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;
    private final CartRepository cartRepository;
    private final ItemService itemService;
    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<CartResponseDTO> getCartItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 인증되지 않은 사용자 처리
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new CartResponseDTO("로그인 후 접근 가능합니다.", null));
        }

        String username = authentication.getName();
        User user = userService.findByUsername(username);

        // 사용자가 존재하지 않거나, 문제가 있을 경우 처리
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new CartResponseDTO("사용자를 찾을 수 없습니다.", null));
        }

        // 장바구니 항목 가져오기
        List<CartDTO> cartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
        CartResponseDTO response = new CartResponseDTO("장바구니 항목 조회 성공", cartItems);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addToCart(
            @RequestParam("cartCount") Integer count,
            @RequestParam("itemId") Long itemId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        // 카트에 추가하려는 상품
        Item item = itemService.findById(itemId);

        // 장바구니에 상품이 이미 존재하는지 확인
        Cart existingCartItem = cartRepository.findByUserAndItemAndPaymentStatusFalse(user, item);

        if (existingCartItem != null) {
            // 이미 장바구니에 해당 상품이 있고 결제되지 않은 상태라면, 갯수만 증가
            existingCartItem.setCount(existingCartItem.getCount() + count);
            Cart updatedCartItem = cartRepository.save(existingCartItem);  // 장바구니에 갯수 업데이트

            // 성공 메시지와 함께 장바구니 항목 리스트 반환
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
            CartResponseDTO response = new CartResponseDTO("수량이 업데이트되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);  // ResponseEntity<CartResponseDTO> 반환
        } else {
            // 장바구니에 해당 상품이 없으면 새로운 항목 추가
            CartDTO cartDTO = new CartDTO();
            cartDTO.setCount(count);
            cartDTO.setItem(item);
            cartDTO.setUser(user);

            CartDTO addedCartItem = cartService.addCartItem(cartDTO, String.valueOf(user.getId()));

            // 성공 메시지와 함께 장바구니 항목 리스트 반환
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
            CartResponseDTO response = new CartResponseDTO("상품이 장바구니에 추가되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);  // ResponseEntity<CartResponseDTO> 반환
        }
    }

    //장바구니 체크박스 업데이트
    @PutMapping("/update/checkbox/{itemId}")
    public ResponseEntity<CartResponseDTO> updateCartCheckbox(@PathVariable Long itemId, @RequestBody Map<String, Boolean> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        boolean isChecked = body.get("isChecked");

        try {
            cartService.updateIsChecked(itemId, isChecked, user);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
            CartResponseDTO response = new CartResponseDTO("체크박스 상태가 업데이트되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponseDTO response = new CartResponseDTO("체크박스 상태 업데이트 실패", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //장바구니 수량 업데이트
    @PutMapping("/update/count/{itemId}")
    public ResponseEntity<CartResponseDTO> updateCartCount(@PathVariable Long itemId, @RequestBody Map<String, Integer> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        int count = body.get("count");

        try {
            cartService.updateCount(itemId, count, user);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
            CartResponseDTO response = new CartResponseDTO("수량이 업데이트되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponseDTO response = new CartResponseDTO("수량 업데이트 실패", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 개별 항목 삭제 메서드
    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<CartResponseDTO> deleteCartItem(@PathVariable Long itemId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        try {
            cartService.deleteCartItem(itemId, user);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
            CartResponseDTO response = new CartResponseDTO("장바구니 항목이 삭제되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponseDTO response = new CartResponseDTO("장바구니 항목 삭제 실패", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 체크된 항목 삭제 메서드
    @DeleteMapping("/delete/checked")
    public ResponseEntity<CartResponseDTO> deleteCheckedItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        try {
            cartService.deleteCheckedItems(user);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
            CartResponseDTO response = new CartResponseDTO("선택한 항목이 삭제되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponseDTO response = new CartResponseDTO("선택한 항목 삭제 실패", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //결제대기로
    @GetMapping("/checkout")
    public ResponseEntity<CartResponseDTO> getCheckedItemsForCheckout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        List<CartDTO> checkedItems = cartService.getAvailableCartItems(user);
        CartResponseDTO response = new CartResponseDTO("결제대기 항목 조회 성공", checkedItems);
        return ResponseEntity.ok(response);
    }
}

