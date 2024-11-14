package com.sports.comment.DTO;

import com.sports.comment.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private Long userId;
    private String username;
    private Long itemId;  // 상품에 달린 댓글
    private Long boardId; // 게시판에 달린 댓글
    private Long parentId;
    private Timestamp createdAt;
    private int likes;

    public static CommentDTO fromCommentResponse(Comment comment, String username) {
        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getUserId(),
                username,
                comment.getItemId(),
                comment.getBoardId(),
                comment.getParentId(),
                comment.getCreatedAt(),
                comment.getLikes()
        );
    }
}
