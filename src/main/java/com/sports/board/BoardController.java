package com.sports.board;

import com.sports.Chat.ChatRoom.ChatRoomRepository;
import com.sports.Item.DTO.ItemDTO;
import com.sports.like.LikeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
//@Slf4j // 테스트 로거
public class BoardController {

    private final BoardService boardService;
    private final LikeService likeService;
    private final ChatRoomRepository chatRoomRepository;

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

    // 메인페이지 게시글 보내기 (최신글 기준)
    @GetMapping("/main")
    public Map<String, List<BoardResponseDTO>> getMainBoards() {
        // 원하는 카테고리 태그 설정
        List<String> tags = Arrays.asList("운동", "공지사항", "모집", "자유");
        return boardService.getMainBoardsByTags(tags);
    }

    // 글쓰기
    @PostMapping("/add")
    public ResponseEntity<Long> createBoard(@ModelAttribute BoardRequestDTO boardRequestDTO) throws IOException {
        return ResponseEntity.ok(boardService.createBoard(boardRequestDTO));
    }

    // 이미지만
    @PostMapping("/fileAdd")
    public ResponseEntity<String> responseUploadUrl(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(boardService.processImage(file));
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
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long id) {
        Board board = boardService.getBoardEntityById(id); // Board 엔티티 가져오기
        boardService.deleteBoard(board); // 삭제 메서드 호출
        chatRoomRepository.deleteByBoardId(id);
        return ResponseEntity.ok("게시판 ID " + id + "가 성공적으로 삭제되었습니다.");
    }

    // 좋아요 토글
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long id) {
        Map<String, Object> response = likeService.toggleBoardLike(id); // 좋아요 상태와 좋아요 수 반환
        return ResponseEntity.ok(response);
    }

    // 검색(게시판)
    @GetMapping("/search")
    public ResponseEntity<List<BoardResponseDTO>> searchBoards(@RequestParam String keyword) {
        List<BoardResponseDTO> searchResults = boardService.searchBoardByTitle(keyword);
        return ResponseEntity.ok(searchResults);
    }

}