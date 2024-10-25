package com.sports.Cart;

import com.sports.Item.ItemDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.sql.Timestamp;

@Data
@RequiredArgsConstructor
public class CartDTO {
    private Long id;
    private Long userId;
    private String username;
    private ItemDTO item; // ItemDTO를 사용하여 아이템 정보 포함
    private Integer count;
    private Timestamp orderTime;
    private boolean paymentStatus;

    public CartDTO(Long id, Long userId, String username, ItemDTO item, Integer count, Timestamp orderTime, boolean paymentStatus) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.item = item; // ItemDTO를 통해 아이템 정보를 저장
        this.count = count;
        this.orderTime = orderTime;
        this.paymentStatus = paymentStatus;
    }

    public CartDTO(Cart cart) {
        this.id = cart.getId();
        this.userId = cart.getUserId();
        this.username = cart.getUsername();
        this.item = new ItemDTO(
                cart.getItem().getId(),
                cart.getItem().getTitle(),
                cart.getItem().getPrice(),
                cart.getItem().getDesc(),
                cart.getItem().getImgurl(),
                cart.getItem().getStock(),
                cart.getItem().getCategory() != null ? cart.getItem().getCategory().getId() : null
        );
        this.count = cart.getCount();
        this.orderTime = cart.getOrderTime();
        this.paymentStatus = cart.isPaymentStatus();
    }
}
