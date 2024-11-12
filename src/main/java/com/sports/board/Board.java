package com.sports.board;

import com.sports.Category.Category;
import com.sports.user.entito.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // 제목

    @Column(columnDefinition = "TEXT")
    private String content; // 본문

    @Column(length = 2048)
    private String imgUrl;  // 이미지

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt; // 작성일

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt; // 수정일

    @Column(nullable = false)
    private int likes;               // 좋아요

    @Column(nullable = false)
    private int views;               // 조회수

    // 게시글 작성자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    // 게시글 카테고리
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

}
