package com.sports.Cart;

import com.sports.Item.Item;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    private Timestamp orderTime;

    private boolean paymentStatus = false;

    private boolean isChecked = false;
}
