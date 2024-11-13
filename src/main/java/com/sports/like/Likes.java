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
public class Likes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long targetId; // 좋아요 대상 ID (예: id가 1인 게시물(board))

    private String targetType; // 좋아요 대상 테이블 (예: "Board", "Item", "Comment")
}
