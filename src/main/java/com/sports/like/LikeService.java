package com.sports.like;

import com.sports.board.Board;
import com.sports.board.BoardRepository;
import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final BoardRepository boardRepository;
    private final UserContextService userContextService;

    @Transactional
    public Map<String, Object> toggleLikeWithResponse(String targetType, Long targetId) {
        User currentUser = userContextService.getCurrentUser(); // 현재 로그인된 사용자 가져오기

        Board board = boardRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        Map<String, Object> response = new HashMap<>();
        Optional<Likes> existingLike = likeRepository.findByUserAndTargetIdAndTargetType(currentUser, targetId, targetType);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get()); // 좋아요 취소
            board.setLikes(board.getLikes() - 1); // 좋아요 수 감소
            response.put("isLiked", false);
        } else {
            Likes like = Likes.builder()
                    .user(currentUser)
                    .targetId(targetId)
                    .targetType(targetType)
                    .build();
            likeRepository.save(like); // 좋아요 추가
            board.setLikes(board.getLikes() + 1); // 좋아요 수 증가
            response.put("isLiked", true);
        }

        boardRepository.save(board);
        response.put("likeCount", board.getLikes()); // 변경된 좋아요 수 반환
        return response;
    }
}