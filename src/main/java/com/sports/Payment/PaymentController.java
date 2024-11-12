package com.sports.Payment;

import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserContextService userContextService;

    @PostMapping("/process")
    public ResponseEntity<PaymentDTO> processPayment(@RequestBody String paymentMethod, @RequestBody String deliveryAddress) {
        User user = userContextService.getCurrentUser();

        // 결제 프로세스를 처리하고 결제 DTO 반환
        try {
            PaymentDTO paymentDTO = paymentService.processPayment(user.getId(), paymentMethod, deliveryAddress);
            return ResponseEntity.ok(paymentDTO); // 성공적으로 결제 처리
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // 예외 발생 시 서버 에러로 응답 (500 Internal Server Error)
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentDTO>> getPaymentHistory() {
        User user = userContextService.getCurrentUser();

        // 결제 내역과 결제 상세 정보를 포함한 PaymentDTO 반환
        List<PaymentDTO> paymentHistory = paymentService.getPaymentsByUser(user.getId());

        return ResponseEntity.ok(paymentHistory);
    }
}
