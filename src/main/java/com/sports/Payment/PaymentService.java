package com.sports.Payment;

import com.sports.Cart.Cart;
import com.sports.Cart.CartService;
import com.sports.Item.Item;
import com.sports.Item.ItemRepository;
import com.sports.PaymentDetail.PaymentDetail;
import com.sports.PaymentDetail.PaymentDetailDTO;
import com.sports.user.User;
import com.sports.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CartService cartService;
    private final UserService userService;
    private final ItemRepository itemRepository;  // 아이템 리포지토리 추가

    public PaymentDTO processPayment(Long userId, String paymentMethod) {
        // 1. 유저 정보와 체크된 장바구니 항목들을 가져옵니다.
        User user = userService.findById(userId);
        List<Cart> cartItems = cartService.getAvailableCartEntities(user);

        if (cartItems.isEmpty()) {
            // 장바구니 항목이 비어 있으면 RuntimeException을 던집니다.
            throw new RuntimeException("결제할 장바구니 항목이 없습니다.");
        }

        // 2. Payment 객체 생성 및 설정
        Payment payment = new Payment();
        payment.setPaymentMethod(paymentMethod);
        payment.setUser(user);

        long totalPrice = 0;
        List<PaymentDetail> paymentDetails = new ArrayList<>();

        // 3. 장바구니 항목을 PaymentDetail로 변환하여 리스트에 추가
        for (Cart cart : cartItems) {
            if (cart.isChecked()) {
                PaymentDetail paymentDetail = new PaymentDetail();
                paymentDetail.setItemTitle(cart.getItem().getTitle());
                paymentDetail.setItemPrice(cart.getItem().getPrice());
                paymentDetail.setItemCount(cart.getCount());
                paymentDetail.setItemId(cart.getItem().getId());  // 아이템의 ID를 저장

                // 총 금액을 계산
                totalPrice += (long) cart.getItem().getPrice() * (long) cart.getCount();

                // 결제 상태 업데이트
                cart.setPaymentStatus(true);

                // 4. PaymentDetail 객체에 Payment 객체 설정 (이 부분이 중요)
                paymentDetail.setPayment(payment);  // Payment 객체를 set 해줍니다.

                paymentDetails.add(paymentDetail);
            }
        }

        // 5. Payment 객체에 PaymentDetails 추가 및 총 금액 설정
        payment.setPaymentDetails(paymentDetails);
        payment.setTotalPrice(totalPrice);
        payment.setPaymentWhether(true); // 결제 완료 표시

        // 6. Payment 객체 저장
        paymentRepository.save(payment);

        // 7. 장바구니 항목을 업데이트
        cartService.saveAll(cartItems); // 결제 상태 업데이트 후 저장

        // 8. 아이템 재고 차감
        for (PaymentDetail paymentDetail : paymentDetails) {
            Long itemId = paymentDetail.getItemId(); // 아이템 ID
            int itemCount = paymentDetail.getItemCount(); // 주문 수량

            // 아이템 조회
            Item item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("아이템을 찾을 수 없습니다. itemId: " + itemId));

            // 재고 차감
            int newStock = item.getStock() - itemCount;

            if (newStock < 0) {
                throw new RuntimeException("재고가 부족합니다: " + item.getTitle());
            }

            item.setStock(newStock); // 재고 업데이트
            itemRepository.save(item); // 아이템 저장
        }

        // 9. PaymentDTO 반환
        return convertToPaymentDTO(payment);
    }



    // PaymentDTO로 변환
    private PaymentDTO convertToPaymentDTO(Payment payment) {
        List<PaymentDetailDTO> paymentDetailDTOs = createPaymentDetailDTOs(payment.getPaymentDetails());

        String paymentStatusMessage = payment.isPaymentWhether() ? "결제 완료" : "결제 실패";

        return new PaymentDTO(
                payment.getId(),
                payment.getPaymentMethod(),
                payment.isPaymentWhether(),
                payment.getPaymentTime(),
                payment.getTotalPrice(),
                paymentDetailDTOs,
                paymentStatusMessage
        );
    }

    private List<PaymentDetailDTO> createPaymentDetailDTOs(List<PaymentDetail> paymentDetails) {
        List<PaymentDetailDTO> paymentDetailDTOs = new ArrayList<>();

        if (paymentDetails != null) {
            for (PaymentDetail paymentDetail : paymentDetails) {
                if (paymentDetail != null) {
                    PaymentDetailDTO detailDTO = new PaymentDetailDTO(
                            paymentDetail.getItemTitle(),
                            paymentDetail.getItemPrice(),
                            paymentDetail.getItemCount()
                    );
                    paymentDetailDTOs.add(detailDTO);
                }
            }
        }

        return paymentDetailDTOs;
    }

    public List<PaymentDTO> getPaymentsByUser(Long userId) {
        User user = userService.findById(userId);  // 사용자 정보 조회
        List<Payment> payments = paymentRepository.findByUser(user);  // 사용자 결제 내역 가져오기

        // Payment를 PaymentDTO로 변환
        List<PaymentDTO> paymentDTOs = new ArrayList<>();
        for (Payment payment : payments) {
            paymentDTOs.add(convertToPaymentDTO(payment));
        }

        return paymentDTOs;
    }

}