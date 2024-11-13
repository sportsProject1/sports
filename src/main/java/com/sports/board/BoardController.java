package com.sports.board;

import com.sports.like.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
//@Slf4j // 테스트 로거
public class BoardController {

    private final BoardService boardService;
    private final LikeService likeService;

    // 게시판 전체 데이터 조회 (페이징 및 정렬 처리는 React에서)
    @GetMapping("/list")
    public ResponseEntity<List<BoardResponseDTO>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    // 게시글 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> getBoard(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoardById(id));
    }

    // 글쓰기
    @PostMapping("/add")
    public ResponseEntity<Long> createBoard(@ModelAttribute BoardRequestDTO boardRequestDTO) throws IOException {
        return ResponseEntity.ok(boardService.createBoard(boardRequestDTO));
    }

    // 글 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBoard(@PathVariable Long id,
                                              @ModelAttribute BoardRequestDTO boardRequestDTO) throws IOException {

        Board board = boardService.getBoardEntityById(id);
        boardService.updateBoard(board, boardRequestDTO);

        return ResponseEntity.ok("게시판 ID " + id + "가 성공적으로 수정되었습니다.");
    }

    // 글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long id) {
        Board board = boardService.getBoardEntityById(id); // Board 엔티티 가져오기
        boardService.deleteBoard(board); // 삭제 메서드 호출
        return ResponseEntity.ok("게시판 ID " + id + "가 성공적으로 삭제되었습니다.");
    }

    // 좋아요 토글
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long id) {
        Map<String, Object> response = likeService.toggleBoardLike(id); // 좋아요 상태와 좋아요 수 반환
        return ResponseEntity.ok(response);
    }

}