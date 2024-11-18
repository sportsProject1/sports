package com.sports.board;

import com.sports.Category.Category;
import com.sports.Category.CategoryRepository;
import com.sports.Item.S3Service;
import com.sports.like.LikeRepository;
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
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final UserContextService userContextService;
    private final S3Service s3Service;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    // 게시판 전체 데이터 조회
    public List<BoardResponseDTO> getAllBoards() {
        return boardRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // 게시글 상세 조회
    @Transactional
    public BoardResponseDTO getBoardById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 조회수 증가
        board.setViews(board.getViews() + 1);
        boardRepository.save(board);

        return toResponseDTO(board);
    }

    // 글쓰기
    @Transactional
    public Long createBoard(BoardRequestDTO boardRequestDTO) throws IOException {
        Long userId = userContextService.getCurrentUserId();

        // 작성자 확인
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 작성자를 찾을 수 없습니다."));

        // 카테고리 확인
        Category category = categoryRepository.findById(boardRequestDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));

        // 이미지 처리 (이미지가 있을 경우 저장, 없으면 imgUrl = null)
        String imgURL = processImagesAndNull(boardRequestDTO.getFile());
        boardRequestDTO.setImgUrl(imgURL);

        // 게시글 엔티티 생성
        Board board = toEntity(boardRequestDTO, author, category);
        board.setImgUrl(imgURL); // 이미지 URL 추가

        // 게시글 저장 및 ID 반환
        return boardRepository.save(board).getId();
    }

    // 글 수정
    @Transactional
    @PreAuthorize("#board.author.username == authentication.name or hasRole('ROLE_MANAGER')")
    // authentication에 접근 권한이 없는 경우(작성자가 아님 or ROLE_MANAGER 아님) 403 Forbidden
    public void updateBoard(@P("board") Board board, BoardRequestDTO boardRequestDTO) throws IOException {

        // 새로운 파일 처리 (없으면 null 반환)
        String newFileUrls = processImagesAndNull(boardRequestDTO.getFile());

        // 기존 이미지 처리
        String existingImages = boardRequestDTO.getImgUrl();

        // 새로운 파일과 기존 이미지를 병합
        String combinedImageUrls;
        if (existingImages != null && !existingImages.isEmpty()) {
            // 기존 이미지가 있을 때
            combinedImageUrls = (newFileUrls != null && !newFileUrls.isEmpty())
                    ? existingImages + "," + newFileUrls // 기존 + 새로운 이미지 병합
                    : existingImages; // 새로운 파일이 없으면 기존 이미지만
        } else {
            // 기존 이미지가 없을 때
            combinedImageUrls = newFileUrls; // 새로운 파일만 저장 (null 가능)
        }

        // 최종 URL 설정
        board.setImgUrl(combinedImageUrls);

        // 카테고리 변경
        Category category = categoryRepository.findById(boardRequestDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 카테고리입니다."));
        board.setCategory(category);

        // 제목 및 내용 변경
        board.setTitle(boardRequestDTO.getTitle());
        board.setContent(boardRequestDTO.getContent());

        boardRepository.save(board);
    }

    // 글 삭제
    @Transactional
    @PreAuthorize("#board.author.username == authentication.name or hasRole('ROLE_MANAGER')")
    public void deleteBoard(@P("board") Board board) {
        boardRepository.delete(board);
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
                .imgUrl(board.getImgUrl())
                .build();
    }

    // Entity 변환 메서드
    private Board toEntity(BoardRequestDTO dto, User author, Category category) {
        return Board.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(author)
                .category(category)
                .chatroom(dto.isChatroom())
                .build();
    }

    // 권한검사 @PreAuthorize 어노테이션 사용을 위한 보드객체 반환 메서드
    @Transactional(readOnly = true)
    public Board getBoardEntityById(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    // 이미지 단일 처리 - 파일 안보내도 기본이미지 저장
    String processImage(MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            return s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());
        }
        // 기본 이미지 저장 처리
        return s3Service.saveFile(null, null);
    }

    // 여러 이미지 처리 - 파일 안보내도 기본이미지 저장
    private String processImages(List<MultipartFile> files) throws IOException {
        if (files != null && !files.isEmpty()) {
            String fileUrls = s3Service.saveFiles(files);
            return fileUrls;
        }
        // 기본 이미지 저장 처리
        return s3Service.saveFile(null, null);
    }

    // 여러 이미지 처리 - 파일 안보내면 imgUrl필드 null값
    private String processImagesAndNull(List<MultipartFile> files) throws IOException {
        if (files != null && !files.isEmpty()) {
            String fileUrls = s3Service.saveFiles(files);
            return fileUrls;
        }
        // 기본 이미지 없이 imgUrl = null
        return null;
    }

    //검색기능(보드)
    public List<BoardResponseDTO> searchBoardByTitle(String keyword) {
        List<Board> boards = boardRepository.searchByTitle(keyword);
        return boards.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BoardResponseDTO convertToDTO(Board board) {
        return new BoardResponseDTO(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getImgUrl(),
                board.getCreatedAt(),
                board.getUpdatedAt(),
                board.getLikes(),
                board.getViews(),
                board.getAuthor().getUsername(),
                board.getCategory().getName()
        );
    }
}
