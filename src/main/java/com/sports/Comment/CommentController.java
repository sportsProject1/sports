package com.sports.Comment;

import com.sports.Comment.DTO.CommentDTO;
import com.sports.Comment.DTO.CommentResponseDTO;
import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comment")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;
    private final UserContextService userContextService;

    @PostMapping("/add/{target}/{id}")
    public ResponseEntity<CommentResponseDTO> addComment(
            @PathVariable String target,
            @PathVariable Long id,
            @RequestBody CommentDTO commentDTO
    ) {
        try {
            // 현재 유저 정보 가져오기
            User user = userContextService.getCurrentUser();
            Long userId = user.getId();  // 유저 ID 가져오기

            // 댓글 저장 서비스 호출
            CommentResponseDTO responseDTO = commentService.addComment(target, id, commentDTO, userId);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new CommentResponseDTO("댓글 추가 실패", null));
        }
    }
}