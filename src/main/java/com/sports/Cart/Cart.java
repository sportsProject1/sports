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

    @Column(name = "cart_userId", nullable = false)
    private Long userId;

    @Column(name = "cart_username", nullable = false)
    private String username;

    @Column(name = "cart_itemTitle", nullable = false)
    private String title;

    @Column(name = "cart_itemPrice", nullable = false)
    private Integer price;

    @Column(name = "cart_count", nullable = false)
    private Integer count;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @CreationTimestamp
    private Timestamp orderTime;

    private boolean paymentStatus = false;
}
