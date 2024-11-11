package com.sports.like;

import com.sports.user.entito.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long targetId; // 좋아요 대상 ID

    private String targetType; // 좋아요 대상 테이블 (예: "Board", "Item")

    private LocalDateTime createdAt;
}
