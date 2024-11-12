package com.sports.Cart;

import lombok.Data;

import java.util.List;

@Data
public class CartResponseDTO {
    private String message;
    private List<CartDTO> cartItems;
    private String deliveryAddress;

    public CartResponseDTO(String message, List<CartDTO> cartItems) {
        this.message = message;
        this.cartItems = cartItems;
    }

    public CartResponseDTO(String message, List<CartDTO> cartItems, String deliveryAddress) {
        this.message = message;
        this.cartItems = cartItems;
        this.deliveryAddress = deliveryAddress;
    }
}
