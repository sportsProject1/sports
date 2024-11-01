package com.sports.Payment;

import com.sports.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p JOIN p.carts c WHERE c.user = :user")
    List<Payment> findByUser(@Param("user") User user);
}
