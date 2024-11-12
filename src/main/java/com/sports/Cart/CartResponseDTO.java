package com.sports.Cart;

import lombok.Data;

import java.util.List;

@Data
public class CartResponseDTO {
    private String message;
    private List<CartDTO> cartItems;
    private String deliveryAddress;
    private String phoneNumber;
    private String name;

    public CartResponseDTO(String message, List<CartDTO> cartItems) {
        this.message = message;
        this.cartItems = cartItems;
    }

    public CartResponseDTO(String message, List<CartDTO> cartItems, String deliveryAddress, String phoneNumber, String name) {
        this.message = message;
        this.cartItems = cartItems;
        this.deliveryAddress = deliveryAddress;
        this.phoneNumber = phoneNumber;
        this.name = name;
    }
}
