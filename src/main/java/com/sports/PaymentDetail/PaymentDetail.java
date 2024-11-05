package com.sports.PaymentDetail;

import com.sports.Payment.Payment;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PaymentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemTitle;
    private Integer itemPrice;
    private Integer itemCount;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;
}
