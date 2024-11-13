package com.sports.Cart.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    private Long cartId;  // 장바구니 항목 ID
    private Integer count;  // 수량
    private Long itemId;  // 아이템 ID
    private String itemTitle;  // 아이템 제목
    private Integer itemPrice;  // 아이템 가격
    private String itemImgUrl;  // 아이템 이미지 URL
    private Long userId;  // 사용자 ID
    private boolean paymentStatus;  // 결제 상태
    private boolean isChecked;  // 체크 상태
}
