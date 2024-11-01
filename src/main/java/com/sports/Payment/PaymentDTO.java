package com.sports.Payment;

import com.sports.Cart.CartDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;

    private String paymentMethod;

    private boolean paymentWhether;

    private Timestamp paymentTime;

    private List<CartDTO> carts;
}
