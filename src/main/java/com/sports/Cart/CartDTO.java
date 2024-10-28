package com.sports.Cart;

import com.sports.Item.ItemDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.sql.Timestamp;

@Data
@RequiredArgsConstructor
public class CartDTO {
    private Long id;
    private Integer count;
    private Long itemId;
    private Long userId;
    private boolean paymentStatus;
}
