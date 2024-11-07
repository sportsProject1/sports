package com.sports.Payment;

import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    @PostMapping("/process")
    public ResponseEntity<PaymentDTO> processPayment(@RequestBody String paymentMethod) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user;

        try {
            user = userService.findByUsername(username);  // Username을 통해 User 정보 가져오기
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 유저가 없을 경우
        }

        // 결제 프로세스를 처리하고 결제 DTO 반환
        try {
            PaymentDTO paymentDTO = paymentService.processPayment(user.getId(), paymentMethod);
            return ResponseEntity.ok(paymentDTO); // 성공적으로 결제 처리
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // 예외 발생 시 서버 에러로 응답 (500 Internal Server Error)
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentDTO>> getPaymentHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user;

        try {
            user = userService.findByUsername(username); // Username을 통해 User 정보 가져오기
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 유저가 없을 경우
        }

        List<PaymentDTO> paymentHistory = paymentService.getPaymentsByUser(user.getId());

        if (paymentHistory.isEmpty()) {
            return ResponseEntity.ok(paymentHistory); // 빈 리스트로 응답
        }

        return ResponseEntity.ok(paymentHistory);  // 결제 내역 리스트 반환
    }
}
