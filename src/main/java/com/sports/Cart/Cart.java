package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.Payment.Payment;
import com.sports.user.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cart_count", nullable = false)
    private Integer count;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    private Timestamp orderTime;

    private boolean paymentStatus = false;

    private boolean isChecked = false;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;
}
