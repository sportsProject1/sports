package com.sports.Payment;

import com.sports.Cart.Cart;
import com.sports.Cart.CartDTO;
import com.sports.Cart.CartService;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserService userService;
    private final CartService cartService;
    private final PaymentRepository paymentRepository;

    public Payment processPayment(Long userId, String paymentMethod) {
        User user = userService.findById(userId);
        List<Cart> cartItems = cartService.getAvailableCartEntities(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("장바구니가 비어 있습니다. 결제를 진행할 수 없습니다.");
        }

        Payment payment = new Payment();
        payment.setPaymentMethod(paymentMethod);
        payment.setCarts(cartItems);

        for (Cart cart : cartItems) {
            cart.setPaymentStatus(true);
        }

        return paymentRepository.save(payment);
    }

    public List<CartDTO> getCompletedPaymentsForUser(Long userId) {
        List<Payment> completedPayments = paymentRepository.findAll();
        List<CartDTO> result = new ArrayList<>();

        for (Payment payment : completedPayments) {
            for (Cart cart : payment.getCarts()) {
                if (cart.isPaymentStatus() && cart.getUser().getId().equals(userId)) {
                    result.add(convertToDto(cart));
                }
            }
        }

        return result;
    }

    private CartDTO convertToDto(Cart cart) {
        return new CartDTO(
                cart.getId(),
                cart.getCount(),
                cart.getItem(),
                cart.getUser(),
                cart.isPaymentStatus(),
                cart.isChecked()
        );
    }

}
