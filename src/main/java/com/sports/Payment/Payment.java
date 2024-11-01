package com.sports.Payment;

import com.sports.Cart.Cart;
import com.sports.user.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentMethod;

    private boolean paymentWhether = false;

    @CreationTimestamp
    private LocalDateTime paymentTime;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL)
    private List<Cart> carts;
}
