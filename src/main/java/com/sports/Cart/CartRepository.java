package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // 사용자 아이디로 장바구니 항목 조회
    List<Cart> findByUserId(Long userId);

    // 사용자 아이디와 체크 상태로 장바구니 항목 조회
    List<Cart> findByUserIdAndIsChecked(Long userId, boolean isChecked);

    // 사용자 아이디, 체크 상태, 결제 상태로 장바구니 항목 조회
    List<Cart> findByUserIdAndIsCheckedAndPaymentStatus(Long userId, boolean isChecked, boolean paymentStatus);

    // 사용자 아이디와 아이템으로 결제되지 않은 장바구니 항목 조회
    Cart findByUserIdAndItemAndPaymentStatusFalse(Long userId, Item item);
}
