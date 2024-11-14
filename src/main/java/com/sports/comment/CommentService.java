package com.sports.comment;

import com.sports.comment.DTO.CommentDTO;
import com.sports.comment.DTO.CommentResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    //댓글 작성
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

        Comment savedComment = commentRepository.save(newComment);

        return new CommentResponseDTO("댓글이 성공적으로 추가되었습니다.", List.of(CommentDTO.fromCommentResponse(savedComment)));
    }

    //댓글 수정
    public CommentResponseDTO updateComment(Long commentId, CommentDTO commentDTO, Long userId) {

        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));


        if (!existingComment.getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }


        existingComment.setContent(commentDTO.getContent());


        Comment updatedComment = commentRepository.save(existingComment);


        return new CommentResponseDTO("댓글이 성공적으로 수정되었습니다.",
                List.of(CommentDTO.fromCommentResponse(updatedComment)));
    }

    //댓글 삭제
    public CommentResponseDTO deleteComment(Long commentId, Long userId) {

        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!existingComment.getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        List<Comment> replyComments = commentRepository.findByParentId(commentId);
        if (!replyComments.isEmpty()) {
            commentRepository.deleteAll(replyComments);
        }

        commentRepository.delete(existingComment);

        return new CommentResponseDTO("댓글이 성공적으로 삭제되었습니다.", null);
    }

    //대댓글 작성
    public CommentResponseDTO addReplyComment(Long commentId, CommentDTO commentDTO, Long userId) {

        Comment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("원댓글을 찾을 수 없습니다."));


        Comment replyComment = new Comment();
        replyComment.setContent(commentDTO.getContent());
        replyComment.setUserId(userId);
        replyComment.setLikes(0);
        replyComment.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        replyComment.setParentId(commentId);

        if (parentComment.isItemComment()) {
            replyComment.setItemId(parentComment.getItemId());
            replyComment.setBoardId(null);
        } else if (parentComment.isBoardComment()) {
            replyComment.setBoardId(parentComment.getBoardId());
            replyComment.setItemId(null);
        }

        Comment savedReplyComment = commentRepository.save(replyComment);

        return new CommentResponseDTO("대댓글이 성공적으로 추가되었습니다.",
                List.of(CommentDTO.fromCommentResponse(savedReplyComment)));
    }
}
