package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.Item.ItemService;
import com.sports.Security.JwtTokenProvider;
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

    private final JwtTokenProvider jwtTokenProvider;
    private final CartService cartService;
    private final ItemService itemService;
    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<List<CartDTO>> getCartItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        List<CartDTO> cartItems = cartService.getCartItemsByUserId(String.valueOf(user.getId()));
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @RequestParam("cartCount") Integer count,
            @RequestParam("itemId") Long itemId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        CartDTO cartDTO = new CartDTO();
        cartDTO.setCount(count);
        Item item = itemService.findById(itemId);
        cartDTO.setItem(item);
        cartDTO.setUser(user);

        CartDTO addedCartItem = cartService.addCartItem(cartDTO, String.valueOf(user.getId()));
        return ResponseEntity.ok(addedCartItem);
    }

//    @PutMapping("/update/{id}")
//    public ResponseEntity<String> updateCartItem(
//            @PathVariable Long id,
//            @RequestBody CartDTO cartDTO) {
//
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName();
//
//        User user = userService.findByUsername(username);
//
//        cartService.update(id, cartDTO, user);
//        return ResponseEntity.ok("장바구니 항목이 업데이트되었습니다.");
//    }

    //장바구니 체크박스 업데이트
    @PutMapping("/update/checkbox/{itemId}")
    public ResponseEntity<?> updateCartCheckbox(@PathVariable Long itemId, @RequestBody Map<String, Boolean> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        boolean isChecked = body.get("isChecked");

        try {
            cartService.updateIsChecked(itemId, isChecked, user);
            return ResponseEntity.ok("체크박스 상태가 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("체크박스 상태 업데이트 실패");
        }
    }

    //장바구니 수량 업데이트
    @PutMapping("/update/count/{itemId}")
    public ResponseEntity<?> updateCartCount(@PathVariable Long itemId, @RequestBody Map<String, Integer> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        int count = body.get("count");

        try {
            cartService.updateCount(itemId, count, user);
            return ResponseEntity.ok("수량이 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수량 업데이트 실패");
        }
    }

//    @DeleteMapping("/delete")
//    public ResponseEntity<String> deleteCheckedItems() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName();
//
//        User user = userService.findByUsername(username);
//
//        cartService.deleteCheckedItems(user);
//        return ResponseEntity.ok("선택한 항목이 삭제되었습니다.");
//    }

    // 개별 항목 삭제 메서드
    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable Long itemId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        try {
            cartService.deleteCartItem(itemId, user);
            return ResponseEntity.ok("장바구니 항목이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("장바구니 항목 삭제 실패");
        }
    }

    // 체크된 항목 삭제 메서드
    @DeleteMapping("/delete/checked")
    public ResponseEntity<String> deleteCheckedItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        try {
            cartService.deleteCheckedItems(user);
            return ResponseEntity.ok("선택한 항목이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("선택한 항목 삭제 실패");
        }
    }

    //결제대기로
    @GetMapping("/checkout")
    public ResponseEntity<List<CartDTO>> getCheckedItemsForCheckout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        List<CartDTO> checkedItems = cartService.getAvailableCartItems(user);
        return ResponseEntity.ok(checkedItems);
    }
}

