package com.sports.comment;

import com.sports.comment.DTO.CommentDTO;
import com.sports.comment.DTO.CommentResponseDTO;
import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comment")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;
    private final UserContextService userContextService;

    //댓글 추가
    @PostMapping("/add/{target}/{id}")
    public ResponseEntity<CommentResponseDTO> addComment(
            @PathVariable String target,
            @PathVariable Long id,
            @RequestBody CommentDTO commentDTO
    ) {
        try {
            User user = userContextService.getCurrentUser();
            Long userId = user.getId();

            CommentResponseDTO responseDTO = commentService.addComment(target, id, commentDTO, userId);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new CommentResponseDTO("댓글 추가 실패", null));
        }
    }

    //댓글 수정
    @PutMapping("/update/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentDTO commentDTO) {

        User user = userContextService.getCurrentUser();
        Long userId = user.getId();

        CommentResponseDTO response = commentService.updateComment(commentId, commentDTO, userId);

        return ResponseEntity.ok(response);
    }

    //댓글 작성
    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<CommentResponseDTO> deleteComment(@PathVariable Long commentId) {
        User user = userContextService.getCurrentUser();
        Long userId = user.getId();

        CommentResponseDTO response = commentService.deleteComment(commentId, userId);

        return ResponseEntity.ok(response);
    }

    //대댓글 작성
    @PostMapping("/add/reply/{commentId}")
    public ResponseEntity<CommentResponseDTO> addReplyComment(
            @PathVariable Long commentId,
            @RequestBody CommentDTO commentDTO) {

        User user = userContextService.getCurrentUser();
        Long userId = user.getId();

        CommentResponseDTO response = commentService.addReplyComment(commentId, commentDTO, userId);

        return ResponseEntity.ok(response);
    }
}