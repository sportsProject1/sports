package com.sports.Payment;

import com.sports.Cart.CartDTO;
import com.sports.Cart.CartService;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final CartService cartService;

    @GetMapping("")
    public ResponseEntity<List<CartDTO>> processPayment() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        List<CartDTO> availableCartItems = cartService.getAvailableCartItems(user);
        return ResponseEntity.ok(availableCartItems);
    }

    @GetMapping("/paid")
    public ResponseEntity<List<CartDTO>> getPaidPayments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);

        List<CartDTO> completedPayments = paymentService.getCompletedPaymentsForUser(user.getId());
        return ResponseEntity.ok(completedPayments);
    }
}
