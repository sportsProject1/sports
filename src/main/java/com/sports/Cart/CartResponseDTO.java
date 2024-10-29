package com.sports.Cart;

import lombok.Data;

import java.util.List;

@Data
public class CartResponseDTO {
    private String message;
    private List<CartDTO> cartItems;

    public CartResponseDTO(String message, List<CartDTO> cartItems) {
        this.message = message;
        this.cartItems = cartItems;
    }
}
