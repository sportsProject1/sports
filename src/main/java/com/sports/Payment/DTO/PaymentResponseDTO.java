package com.sports.Payment.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponseDTO {
    private PaymentDTO paymentData;  // 결제 데이터
    private String message;          // 응답 메시지
}
