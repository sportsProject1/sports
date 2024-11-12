package com.sports.Payment;

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
}
