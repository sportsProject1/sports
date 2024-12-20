package com.sports.Payment;

import com.sports.Cart.DTO.CartDTO;
import com.sports.Cart.DTO.CartResponseDTO;
import com.sports.Payment.DTO.PaymentResponseDTO;
import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserContextService userContextService;

    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDTO> processPayment(@RequestBody CartResponseDTO cartResponseDTO) { // 반환 타입 수정
        User user = userContextService.getCurrentUser();

        // CartDTO 리스트로 받기
        List<CartDTO> cartDTOs = cartResponseDTO.getCartItems();
        String paymentMethod = cartResponseDTO.getPaymentMethod();
        String deliveryAddress = cartResponseDTO.getDeliveryAddress();
        String phoneNumber = cartResponseDTO.getPhoneNumber();
        String name = cartResponseDTO.getName();

        try {
            // PaymentResponseDTO를 반환받고 바로 반환
            PaymentResponseDTO paymentResponseDTO = paymentService.processPayment(user.getId(), cartDTOs, paymentMethod, deliveryAddress, phoneNumber, name);
            return ResponseEntity.ok(paymentResponseDTO); // 결제 성공 후 응답
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 예외 처리
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentHistory() { // 반환 타입 수정
        User user = userContextService.getCurrentUser();

        // 결제 내역과 결제 상세 정보를 포함한 PaymentResponseDTO 반환
        List<PaymentResponseDTO> paymentHistory = paymentService.getPaymentsByUser(user.getId());

        return ResponseEntity.ok(paymentHistory);
    }
}