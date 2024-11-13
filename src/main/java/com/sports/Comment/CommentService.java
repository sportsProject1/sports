package com.sports.Comment;

import com.sports.Comment.DTO.CommentDTO;
import com.sports.Comment.DTO.CommentResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    //댓글 생성
    public CommentResponseDTO addComment(String target, Long id, CommentDTO commentDTO, Long userId) {

        Comment newComment = new Comment();
        newComment.setContent(commentDTO.getContent());
        newComment.setUserId(userId);
        newComment.setLikes(0);
        newComment.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        if ("shop".equals(target)) {
            newComment.setItemId(id); // itemId 설정
            newComment.setBoardId(null); // boardId는 null
        } else if ("board".equals(target)) {
            newComment.setBoardId(id); // boardId 설정
            newComment.setItemId(null); // itemId는 null
        }

        // 댓글 저장
        Comment savedComment = commentRepository.save(newComment);

        // 성공적인 응답 반환
        return new CommentResponseDTO("댓글이 성공적으로 추가되었습니다.", List.of(CommentDTO.fromCommentResponse(savedComment)));
    }
}
