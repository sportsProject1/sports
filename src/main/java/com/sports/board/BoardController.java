package com.sports.board;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

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
    public ResponseEntity<Long> createBoard(@ModelAttribute BoardRequestDTO boardRequestDTO,
                                            @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {

        return ResponseEntity.ok(boardService.createBoard(boardRequestDTO, files));
    }

    // 글 수정
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> updateBoard(@PathVariable Long id,
                                                        @ModelAttribute BoardRequestDTO boardRequestDTO,
                                                        @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        BoardResponseDTO updatedBoard = boardService.updateBoard(id, boardRequestDTO, file);
        return ResponseEntity.ok(updatedBoard); // 수정된 정보를 클라이언트에 반환
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