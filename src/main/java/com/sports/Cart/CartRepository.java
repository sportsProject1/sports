package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.user.entito.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);

    List<Cart> findByUserAndIsChecked(User user, boolean isChecked);

    List<Cart> findByUserAndIsCheckedAndPaymentStatus(User user, boolean isChecked, boolean paymentStatus);

    Cart findByUserAndItemAndPaymentStatusFalse(User user, Item item);
}
