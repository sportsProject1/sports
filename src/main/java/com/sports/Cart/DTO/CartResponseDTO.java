package com.sports.Cart.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class CartResponseDTO {
    private String message;
    private List<CartDTO> cartItems;

    private String deliveryAddress;
    private String phoneNumber;
    private String name;
    private String paymentMethod;

    public CartResponseDTO(String message, List<CartDTO> cartItems) {
        this.message = message;
        this.cartItems = cartItems;
    }

    public CartResponseDTO(String message, List<CartDTO> cartItems, String deliveryAddress, String phoneNumber, String name, String paymentMethod) {
        this.message = message;
        this.cartItems = cartItems;
        this.deliveryAddress = deliveryAddress;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.paymentMethod = paymentMethod;
    }
}
