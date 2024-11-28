package com.sports.board;

import com.sports.Chat.ChatRoom.ChatRoom;
import com.sports.Chat.ChatRoom.ChatRoomIdDto;
import com.sports.Chat.ChatRoom.ChatRoomRepository;
import com.sports.like.LikeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        System.out.println("API 호출: /main - 게시판 목록 조회 요청 보드 컨트롤러 board main");

        // 운동, 공지사항, 모집, 자유 / 4개의 카테고리 글 / 5개씩 불러옴
        return boardService.getMainBoardsByTags();
    }

    // 글쓰기
    @PostMapping("/add")
    public ResponseEntity<Long> createBoard(@ModelAttribute BoardRequestDTO boardRequestDTO) throws IOException {
        return ResponseEntity.ok(boardService.createBoard(boardRequestDTO));
    }

    // 이미지만 S3 업로드, 반환
    @PostMapping("/fileAdd")
    public ResponseEntity<String> responseUploadUrl(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(boardService.processImage(file));
    }

    // 썸네일 url 반환
    @PostMapping("/thumbnails")
    public ResponseEntity<List<BoardThumbnailDTO>> getThumbnails(@RequestBody List<Long> boardIds) {
        List<BoardThumbnailDTO> thumbnails = boardService.extractThumbnailsForBoards(boardIds);
        if (!thumbnails.isEmpty()) {
            return ResponseEntity.ok(thumbnails);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 데이터가 없을 경우
        }
    }

    // 글 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBoard(@PathVariable Long id,
                                              @ModelAttribute BoardRequestDTO boardRequestDTO) throws IOException {
        System.out.println(boardRequestDTO);

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

    // 현재 로그인된 사용자에 대한 좋아요 상태반환
    @GetMapping("/likes/status")
    public ResponseEntity<Map<Long, Boolean>> getLikesStatus(
            @RequestParam List<Long> targetIds,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        // 좋아요 상태 가져오기
        Map<Long, Boolean> likeStatus = likeService.getLikeStatusWithToken(targetIds, "Board", authorization);
        return ResponseEntity.ok(likeStatus);
    }

    // 검색(게시판)
    @GetMapping("/search")
    public ResponseEntity<List<BoardResponseDTO>> searchBoards(@RequestParam String keyword) {
        List<BoardResponseDTO> searchResults = boardService.searchBoardByTitle(keyword);
        return ResponseEntity.ok(searchResults);
    }

    // 게시글 아이디로 채팅방 번호 가져오는 로직
    @GetMapping("/{boardId}/chatroom")
    public ResponseEntity<ChatRoomIdDto> getChatRoomIdByBoard(@PathVariable Long boardId) {
        ChatRoom chatRoom = chatRoomRepository.findByBoardId(boardId)
                .orElseThrow(() -> new RuntimeException("해당 게시글에 연결된 채팅방이 없습니다."));

        // ChatRoomIdDto 인스턴스 생성 및 반환
        ChatRoomIdDto chatRoomIdDto = new ChatRoomIdDto(chatRoom.getId());
        return ResponseEntity.ok(chatRoomIdDto);
    }

}