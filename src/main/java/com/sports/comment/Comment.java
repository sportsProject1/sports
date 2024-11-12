package com.sports.comment;

import com.sports.Item.Item;
import com.sports.board.Board;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private Long userId;

    private Long itemId;   // 상품에 달린 댓글을 위한 필드
    private Long boardId;  // 게시판에 달린 댓글을 위한 필드

    private Long parentId;

    @CreationTimestamp
    private Timestamp createdAt;

    private int likes;

    // 둘 중 하나에만 값이 들어가게 설정
    public boolean isItemComment() {
        return itemId != null;
    }

    public boolean isBoardComment() {
        return boardId != null;
    }

}
