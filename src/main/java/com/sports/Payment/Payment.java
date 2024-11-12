package com.sports.Payment;

import com.sports.PaymentDetail.PaymentDetail;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentMethod;

    private boolean paymentWhether = false;

    @CreationTimestamp
    private LocalDateTime paymentTime;

    private Long totalPrice;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL)
    private List<PaymentDetail> paymentDetails;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String deliveryAddress;

    private String phoneNumber;

    private String name;
}
