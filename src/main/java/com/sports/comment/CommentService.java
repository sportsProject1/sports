package com.sports.comment;

import com.sports.comment.DTO.CommentDTO;
import com.sports.comment.DTO.CommentResponseDTO;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    // 댓글 작성
    public CommentResponseDTO addComment(String target, Long id, CommentDTO commentDTO, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Comment newComment = new Comment();
        newComment.setContent(commentDTO.getContent());
        newComment.setUserId(userId);
        newComment.setLikes(0);
        newComment.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        if ("shop".equals(target)) {
            newComment.setItemId(id);
            newComment.setBoardId(null);
        } else if ("board".equals(target)) {
            newComment.setBoardId(id);
            newComment.setItemId(null);
        }

        Comment savedComment = commentRepository.save(newComment);

        return new CommentResponseDTO("댓글이 성공적으로 추가되었습니다.",
                List.of(CommentDTO.fromCommentResponse(savedComment, user.getUsername())));
    }

    // 댓글 수정
    public CommentResponseDTO updateComment(Long commentId, CommentDTO commentDTO, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!existingComment.getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        existingComment.setContent(commentDTO.getContent());
        Comment updatedComment = commentRepository.save(existingComment);

        return new CommentResponseDTO("댓글이 성공적으로 수정되었습니다.",
                List.of(CommentDTO.fromCommentResponse(updatedComment, user.getUsername())));
    }

    // 댓글 삭제
    public CommentResponseDTO deleteComment(Long commentId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

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

        return new CommentResponseDTO("댓글이 성공적으로 삭제되었습니다.",
                List.of(CommentDTO.fromCommentResponse(existingComment, user.getUsername())));
    }

    // 대댓글 작성
    public CommentResponseDTO addReplyComment(Long commentId, CommentDTO commentDTO, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

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
                List.of(CommentDTO.fromCommentResponse(savedReplyComment, user.getUsername())));
    }

    // 댓글 조회
    public List<CommentDTO> getComments(String target, Long id) {
        List<Comment> comments;

        // 댓글과 대댓글을 구분
        if ("shop".equals(target)) {
            comments = commentRepository.findByItemId(id);
        } else if ("board".equals(target)) {
            comments = commentRepository.findByBoardId(id);
        } else {
            throw new IllegalArgumentException("잘못된 요청");
        }

        if (comments.isEmpty()) {
            throw new RuntimeException("댓글 조회 실패");
        }

        // 댓글과 대댓글을 처리
        return comments.stream()
                .map(comment -> {
                    User user = userRepository.findById(comment.getUserId())
                            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
                    CommentDTO commentDTO = CommentDTO.fromCommentResponse(comment, user.getUsername());

                    // parentId가 있다면, 대댓글로 처리
                    if (comment.getParentId() != null) {
                        commentDTO.setParentId(comment.getParentId()); // 대댓글이면 parentId 설정
                    }

                    return commentDTO;
                })
                .collect(Collectors.toList());
    }
}

