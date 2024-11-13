package com.sports.Payment.DTO;

import com.sports.Cart.DTO.CartResponseDTO;
import com.sports.PaymentDetail.PaymentDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private String paymentMethod;
    private boolean paymentWhether;
    private LocalDateTime paymentTime;
    private Long totalPrice;
    private List<PaymentDetailDTO> paymentDetails;
    private String paymentStatusMessage;
    private String deliveryAddress;
    private String phoneNumber;
    private String name;

    // CartResponseDTO를 PaymentDTO로 변환하는 메소드
    public static PaymentDTO fromCartResponse(CartResponseDTO cartResponseDTO, List<PaymentDetailDTO> paymentDetails) {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setName(cartResponseDTO.getName());
        paymentDTO.setPhoneNumber(cartResponseDTO.getPhoneNumber());
        paymentDTO.setDeliveryAddress(cartResponseDTO.getDeliveryAddress());
        paymentDTO.setPaymentWhether(false);
        paymentDTO.setTotalPrice(0L);
        paymentDTO.setPaymentDetails(paymentDetails);
        return paymentDTO;
    }
}
