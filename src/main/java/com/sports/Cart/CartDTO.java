package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.user.User;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
public class CartDTO {
    private Long id;

    @Min(value = 1, message = "상품갯수는 최소 1개 이상이어야 합니다.")
    private Integer count;

    private Item item;
    private User user;

    private boolean paymentStatus;
}
