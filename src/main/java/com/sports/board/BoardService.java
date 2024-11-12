package com.sports.board;

import com.sports.Category.Category;
import com.sports.Category.CategoryRepository;
import com.sports.Item.S3Service;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UserContextService userContextService;
    private final S3Service s3Service;

    // 게시판 전체 데이터 조회
    public List<BoardResponseDTO> getAllBoards() {
        return boardRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // 게시글 상세 조회
    @Transactional
    public BoardResponseDTO getBoardById(Long id) {
        Long currentUserId = userContextService.getCurrentUserId();

        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!board.getAuthor().getId().equals(currentUserId)) {
            board.setViews(board.getViews() + 1); // 조회수 증가 - 본인은 증가안됨 ㅋㅋ
            boardRepository.save(board);
        }
        return toResponseDTO(board);
    }

    // 글쓰기
    @Transactional
    public Long createBoard(BoardRequestDTO boardRequestDTO, MultipartFile file) throws IOException {
        Long userId = userContextService.getCurrentUserId();

        // 작성자 확인
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 작성자를 찾을 수 없습니다."));

        // 카테고리 확인
        Category category = categoryRepository.findById(boardRequestDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));

        // 이미지 처리 (이미지가 있을 경우 저장)
        String imgURL;
        if (file != null && !file.isEmpty()) {
            imgURL = s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());
        } else {
            imgURL = s3Service.saveFile(null, null);
        }
        boardRequestDTO.setImgUrl(imgURL);

        // 게시글 엔티티 생성
        Board board = Board.builder()
                .title(boardRequestDTO.getTitle())
                .content(boardRequestDTO.getContent())
                .author(author)
                .category(category)
                .imgUrl(imgURL) // 저장된 이미지 URL 추가
                .build();

        // 게시글 저장 및 ID 반환
        return boardRepository.save(board).getId();
    }


    // 글 수정
    @PreAuthorize("#board.author.username == authentication.name or hasRole('ROLE_MANAGER')")
    @Transactional
    public void updateBoard(@P("board") Board board, BoardRequestDTO boardRequestDTO) {
        board.setTitle(boardRequestDTO.getTitle());
        board.setContent(boardRequestDTO.getContent());
        boardRepository.save(board);
    }

    // 글 삭제
    @PreAuthorize("#board.author.username == authentication.name or hasRole('ROLE_MANAGER')")
    @Transactional
    public void deleteBoard(@P("board") Board board) {
        boardRepository.delete(board);
    }

    // 좋아요 토글
    @Transactional
    public void toggleLike(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        board.setLikes(board.getLikes() > 0 ? board.getLikes() - 1 : board.getLikes() + 1);
        boardRepository.save(board);
    }

    // DTO 변환 메서드
    private BoardResponseDTO toResponseDTO(Board board) {
        return BoardResponseDTO.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .author(board.getAuthor().getUsername())
                .category(board.getCategory().getName())
                .likes(board.getLikes())
                .views(board.getViews())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }

    private Board toEntity(BoardRequestDTO dto, User author, Category category) {
        return Board.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(author)
                .category(category)
                .build();
    }

    // 권한검사 @PreAuthorize 어노테이션 사용을 위한 보드객체 반환 메서드
    @Transactional(readOnly = true)
    public Board getBoardEntityById(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }
}