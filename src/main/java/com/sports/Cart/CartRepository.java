package com.sports.Cart;

import com.sports.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);

    List<Cart> findByUserAndIsChecked(User user, boolean isChecked);

    List<Cart> findByUserAndIsCheckedAndPaymentStatus(User user, boolean isChecked, boolean paymentStatus);
}
