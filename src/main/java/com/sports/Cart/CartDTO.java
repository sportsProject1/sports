package com.sports.Cart;

import com.sports.Item.Item;
import com.sports.user.entito.User;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long id;

    @Min(value = 1, message = "상품갯수는 최소 1개 이상이어야 합니다.")
    private Integer count;

    private Item item;

    private Long userId;

    private boolean paymentStatus;

    private boolean isChecked;
}
