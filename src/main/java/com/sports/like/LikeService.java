package com.sports.like;

import com.sports.Comment.Comment;
import com.sports.Comment.CommentRepository;
import com.sports.Item.Item;
import com.sports.Item.ItemRepository;
import com.sports.board.Board;
import com.sports.board.BoardRepository;
import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final UserContextService userContextService;
    private final LikeRepository likeRepository;
    private final BoardRepository boardRepository;
    private final ItemRepository itemRepository;
    private final CommentRepository commentRepository;

    // Board 좋아요 토글
    @Transactional
    public Map<String, Object> toggleBoardLike(Long boardId) {
        User currentUser = userContextService.getCurrentUser();

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        Map<String, Object> response = handleLikeToggle(currentUser, boardId, "Board", board.getLikes());
        board.setLikes((int) response.get("likeCount")); // 좋아요 수 갱신
        boardRepository.save(board);

        return response;
    }

    // Item 좋아요 토글
    @Transactional
    public Map<String, Object> toggleItemLike(Long itemId) {
        User currentUser = userContextService.getCurrentUser();

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("아이템을 찾을 수 없습니다."));

        Map<String, Object> response = handleLikeToggle(currentUser, itemId, "Item", item.getLikes());
        item.setLikes((int) response.get("likeCount")); // 좋아요 수 갱신
        itemRepository.save(item);

        return response;
    }

    // Comment 좋아요 토글
    @Transactional
    public Map<String, Object> toggleCommentLike(Long commentId) {
        User currentUser = userContextService.getCurrentUser();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        Map<String, Object> response = handleLikeToggle(currentUser, commentId, "Comment", comment.getLikes());
        comment.setLikes((int) response.get("likeCount")); // 좋아요 수 갱신
        commentRepository.save(comment);

        return response;
    }


    // 공통 좋아요 토글 로직
    private Map<String, Object> handleLikeToggle(User user, Long targetId, String targetType, int currentLikes) {
        Map<String, Object> response = new HashMap<>();
        Optional<Likes> existingLike = likeRepository.findByUserAndTargetIdAndTargetType(user, targetId, targetType);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get()); // 좋아요 취소
            response.put("isLiked", false);
            response.put("likeCount", currentLikes - 1); // 좋아요 감소
        } else {
            Likes like = Likes.builder()
                    .user(user)
                    .targetId(targetId)
                    .targetType(targetType)
                    .build();
            likeRepository.save(like); // 좋아요 추가
            response.put("isLiked", true);
            response.put("likeCount", currentLikes + 1); // 좋아요 증가
        }

        return response;
    }
}