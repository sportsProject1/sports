package com.sports.Payment;

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
        paymentDTO.setPaymentStatusMessage(cartResponseDTO.getMessage());
        paymentDTO.setPaymentWhether(false); // 기본값 설정. 실제 결제 여부는 처리 후 설정
        paymentDTO.setTotalPrice(0L); // 실제 계산된 가격을 설정해야 함
        paymentDTO.setPaymentDetails(paymentDetails);
        return paymentDTO;
    }
}
