package com.sports.board;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    // 게시판 전체 데이터 조회 (React에서 페이징 및 정렬 처리)
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
    public ResponseEntity<Long> createBoard(@RequestBody BoardRequestDTO boardRequestDTO) {
        return ResponseEntity.ok(boardService.createBoard(boardRequestDTO));
    }

    // 글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBoard(@PathVariable Long id, @RequestBody BoardRequestDTO boardRequestDTO) {
        Board board = boardService.getBoardEntityById(id);
        boardService.updateBoard(board, boardRequestDTO);
        return ResponseEntity.noContent().build();
    }


    // 글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        Board board = boardService.getBoardEntityById(id); // Board 엔티티 가져오기
        boardService.deleteBoard(board); // 삭제 메서드 호출
        return ResponseEntity.noContent().build();
    }

    // 좋아요 추가/취소
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeBoard(@PathVariable Long id) {
        boardService.toggleLike(id);
        return ResponseEntity.noContent().build();
    }
}