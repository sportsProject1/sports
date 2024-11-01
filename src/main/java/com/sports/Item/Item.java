package com.sports.Item;

import com.sports.Category.Category;
import com.sports.user.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_title", nullable = false, length = 40)
    private String title;

    @Column(name = "item_price", nullable = false)
    private Integer price;

    @Column(name = "item_desc")
    private String desc;

    @Column(name = "item_imgurl", length = 2048) // 충분한 길이 설정
    private String imgurl;

    @Column(name = "item_stock", nullable = false)
    private Integer stock = 0;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
