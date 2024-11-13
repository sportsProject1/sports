package com.sports.Cart;

import com.sports.Cart.DTO.CartDTO;
import com.sports.Cart.DTO.CartResponseDTO;
import com.sports.Item.Item;
import com.sports.Item.ItemService;
import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;
    private final ItemService itemService;
    private final UserContextService userContextService;

    // 장바구니 항목 조회
    @GetMapping("")
    public ResponseEntity<CartResponseDTO> getCartItemsByUserId() {
        User user = userContextService.getCurrentUser();  // 로그인된 사용자 정보 가져오기
        Long userId = user.getId();  // 현재 로그인된 사용자의 ID

        List<CartDTO> cartItems = cartService.getCartItemsByUserId(userId);  // userId를 넘겨줍니다

        CartResponseDTO response = new CartResponseDTO("장바구니 조회 성공", cartItems);
        return ResponseEntity.ok(response);
    }

    // 장바구니 항목 추가
    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @RequestParam("cartCount") Integer count,
            @RequestParam("itemId") Long itemId) {

        User user = userContextService.getCurrentUser();  // 로그인된 사용자 정보 가져오기
        Long userId = user.getId();  // 현재 로그인된 사용자의 ID

        CartDTO cartDTO = new CartDTO();
        cartDTO.setCount(count);
        Item item = itemService.findById(itemId);

        cartDTO.setItemId(item.getId());
        cartDTO.setItemTitle(item.getTitle());
        cartDTO.setItemPrice(item.getPrice());
        cartDTO.setItemImgUrl(item.getImgurl());
        cartDTO.setUserId(userId);

        CartDTO addedCartItem = cartService.addCartItem(cartDTO);  // `userId`를 넘기지 않음
        return ResponseEntity.ok(addedCartItem);
    }

    // 장바구니 체크박스 업데이트
    @PutMapping("/update/checkbox/{cartId}")
    public ResponseEntity<?> updateCartCheckbox(@PathVariable Long cartId, @RequestBody Map<String, Boolean> body) {
        User user = userContextService.getCurrentUser();  // 로그인된 사용자 정보 가져오기
        Long userId = user.getId();  // 현재 로그인된 사용자의 ID

        boolean isChecked = body.get("isChecked");

        try {
            cartService.updateIsChecked(cartId, isChecked, userId);
            return ResponseEntity.ok("체크박스 상태가 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("체크박스 상태 업데이트 실패");
        }
    }

    // 장바구니 수량 업데이트
    @PutMapping("/update/count/{cartId}")
    public ResponseEntity<CartResponseDTO> updateCartCount(@PathVariable Long cartId, @RequestBody Map<String, Integer> body) {
        User user = userContextService.getCurrentUser();  // 로그인된 사용자 정보 가져오기
        Long userId = user.getId();  // 현재 로그인된 사용자의 ID

        int count = body.get("count");

        try {
            cartService.updateCount(cartId, count, userId);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(userId);
            CartResponseDTO response = new CartResponseDTO("수량이 업데이트되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponseDTO response = new CartResponseDTO("수량 업데이트 실패", new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 개별 항목 삭제
    @DeleteMapping("/delete/{cartId}")
    public ResponseEntity<CartResponseDTO> deleteCartItem(@PathVariable Long cartId) {
        User user = userContextService.getCurrentUser();  // 로그인된 사용자 정보 가져오기
        Long userId = user.getId();  // 현재 로그인된 사용자의 ID

        try {
            cartService.deleteCartItem(cartId, userId);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(userId);
            CartResponseDTO response = new CartResponseDTO("장바구니 항목이 삭제되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponseDTO response = new CartResponseDTO("장바구니 항목 삭제 실패", new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 체크된 항목 삭제
    @DeleteMapping("/delete/checked")
    public ResponseEntity<CartResponseDTO> deleteCheckedItems() {
        User user = userContextService.getCurrentUser();  // 로그인된 사용자 정보 가져오기
        Long userId = user.getId();  // 현재 로그인된 사용자의 ID

        try {
            cartService.deleteCheckedItems(userId);
            List<CartDTO> updatedCartItems = cartService.getCartItemsByUserId(userId);
            CartResponseDTO response = new CartResponseDTO("선택한 항목이 삭제되었습니다.", updatedCartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponseDTO response = new CartResponseDTO("선택한 항목 삭제 실패", new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 결제대기 항목 조회
    @GetMapping("/checkout")
    public ResponseEntity<CartResponseDTO> getCheckedItemsForCheckout() {
        User user = userContextService.getCurrentUser();  // 로그인된 사용자 정보 가져오기
        Long userId = user.getId();  // 현재 로그인된 사용자의 ID

        List<CartDTO> checkedItems = cartService.getAvailableCartItems(userId);
        String deliveryAddress = user.getAddress();
        String phoneNumber = user.getPhone();
        String name = user.getNickname();

        CartResponseDTO response = new CartResponseDTO("결제대기 항목 조회 성공", checkedItems, deliveryAddress, phoneNumber, name, null);
        return ResponseEntity.ok(response);
    }
}
