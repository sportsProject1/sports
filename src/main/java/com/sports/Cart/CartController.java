package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.Item.ItemService;
import com.sports.Security.JwtTokenProvider;
import com.sports.user.User;
import com.sports.user.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final JwtTokenProvider jwtTokenProvider;
    private final CartService cartService;
    private final ItemService itemService;
    private final UserContextService userContextService;

    @GetMapping("")
    public ResponseEntity<List<CartDTO>> getCartItems() {
        // 현재 사용자 가져오기
        User user = userContextService.getCurrentUser();
        String userId = String.valueOf(user.getId());

        // 장바구니 항목 조회
        List<CartDTO> cartItems = cartService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @RequestParam("cartCount") Integer count,
            @RequestParam("itemId") Long itemId) {

        User user = userContextService.getCurrentUser();
        String userId = String.valueOf(user.getId());

        // 장바구니 항목 생성
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCount(count);
        Item item = itemService.findById(itemId);
        cartDTO.setItem(item);
        cartDTO.setUserId(user.getId());

        // 장바구니 항목 추가
        CartDTO addedCartItem = cartService.addCartItem(cartDTO, userId);
        return ResponseEntity.ok(addedCartItem);
    }

    // 장바구니 체크박스 업데이트
    @PutMapping("/update/checkbox/{itemId}")
    public ResponseEntity<?> updateCartCheckbox(@PathVariable Long itemId, @RequestBody Map<String, Boolean> body) {
        User user = userContextService.getCurrentUser();
        String userId = String.valueOf(user.getId());

        boolean isChecked = body.get("isChecked");

        try {
            cartService.updateIsChecked(itemId, isChecked, userId);
            return ResponseEntity.ok("체크박스 상태가 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("체크박스 상태 업데이트 실패");
        }
    }

    // 장바구니 수량 업데이트
    @PutMapping("/update/count/{itemId}")
    public ResponseEntity<CartResponseDTO> updateCartCount(@PathVariable Long itemId, @RequestBody Map<String, Integer> body) {
        User user = userContextService.getCurrentUser();
        String userId = String.valueOf(user.getId());

        int count = body.get("count");

        try {
            cartService.updateCount(itemId, count, userId);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(userId);
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
        User user = userContextService.getCurrentUser();
        String userId = String.valueOf(user.getId());

        try {
            cartService.deleteCartItem(itemId, userId);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(userId);
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
        User user = userContextService.getCurrentUser();
        String userId = String.valueOf(user.getId());

        try {
            cartService.deleteCheckedItems(userId);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(userId);
            CartResponseDTO response = new CartResponseDTO("선택한 항목이 삭제되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponseDTO response = new CartResponseDTO("선택한 항목 삭제 실패", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 결제대기 항목 조회
    @GetMapping("/checkout")
    public ResponseEntity<CartResponseDTO> getCheckedItemsForCheckout() {
        User user = userContextService.getCurrentUser();
        String userId = String.valueOf(user.getId());

        List<CartDTO> checkedItems = cartService.getAvailableCartItems(userId);
        CartResponseDTO response = new CartResponseDTO("결제대기 항목 조회 성공", checkedItems);
        return ResponseEntity.ok(response);
    }
}
