package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryDTO;
import com.sports.Category.CategoryService;
import com.sports.Item.DTO.ItemDTO;
import com.sports.Item.DTO.ItemResponseDTO;
import com.sports.like.LikeService;
import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import com.sports.user.service.UserService;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/shop")
public class ItemController {

    private final ItemRepository itemRepository;
    private final ItemService itemService;
    private final S3Service s3Service;
    private final UserContextService userContextService;
    private final LikeService likeService;
    private final UserService userService;

    // 상품 목록 조회
    @GetMapping("/list")
    public ResponseEntity<ItemResponseDTO> shopList() {
        List<Item> items = itemRepository.findAllByIsDeletedFalse();
        List<ItemDTO> itemDTOs = items.stream()
                .map(item -> {
                    String nickname = userService.getNicknameByUserId(item.getUserId());

                    return new ItemDTO(
                            item.getId(),
                            item.getTitle(),
                            item.getPrice(),
                            item.getDesc(),
                            item.getImgurl(),
                            item.getStock(),
                            item.getCategory() != null ? item.getCategory().getId() : null,
                            item.getLikes(),
                            item.getUserId(),
                            nickname
                    );
                })
                .collect(Collectors.toList());

        // 성공 시 message와 items만 반환
        ItemResponseDTO response = new ItemResponseDTO("상품 목록 조회 성공", itemDTOs);
        return ResponseEntity.ok(response);  // message와 items만 포함된 응답
    }

    // 상품 이미지 URL 조회
    @GetMapping("/presigned-url")
    @ResponseBody
    String getURL(@RequestParam(name = "filename") String filename) {
        return s3Service.createPreSignedURL("img/" + filename);
    }

    // 상품 추가
    @PostMapping("/add")
    public ResponseEntity<ItemResponseDTO> postItem(@ModelAttribute ItemDTO itemDTO,
                                                    @RequestParam("file") List<MultipartFile> file) {
        try {
            User user = userContextService.getCurrentUser();
            Long userId = user.getId(); // 현재 사용자의 ID를 가져옴

            if (file == null || file.isEmpty()) {
                // 파일 첨부 오류
                ItemResponseDTO response = new ItemResponseDTO("상품을 추가하려면 파일을 첨부해야 합니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            itemService.addItem(itemDTO, file, userId); // userId 전달
            // 성공적인 상품 추가
            ItemResponseDTO response = new ItemResponseDTO("상품이 성공적으로 추가되었습니다.");
            return ResponseEntity.ok(response);
        } catch (MalformedJwtException e) {
            // JWT 오류
            ItemResponseDTO response = new ItemResponseDTO("잘못된 JWT 형식입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (IOException e) {
            // 파일 처리 오류
            ItemResponseDTO response = new ItemResponseDTO("상품 추가 중 파일 처리에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (RuntimeException e) {
            // 기타 오류
            ItemResponseDTO response = new ItemResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // 일반적인 오류
            ItemResponseDTO response = new ItemResponseDTO("상품 추가에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 상품 상세 조회
    @GetMapping("/detail/{id}")
    public ResponseEntity<ItemResponseDTO> detailItem(@PathVariable(name = "id") Long id) {
        try {
            ItemDTO itemDTO = itemService.getItemDetail(id);
            // 단일 ItemDTO를 사용하여 response 생성
            ItemResponseDTO response = new ItemResponseDTO("상품 조회 성공", itemDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // 상품을 찾을 수 없는 경우
            ItemResponseDTO response = new ItemResponseDTO("상품을 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // 상품 수정
    @PutMapping("/update/{id}")
    public ResponseEntity<ItemResponseDTO> updateItem(
            @PathVariable Long id,
            @ModelAttribute ItemDTO itemDTO, // DTO를 받음
            @RequestParam(value = "file", required = false) List<MultipartFile> file,
            @RequestParam(value = "imgurl", required = false) String imgurl) {
        if (id == null) {
            // 유효하지 않은 상품 ID
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ItemResponseDTO("유효하지 않은 상품 ID입니다."));
        }
        try {
            User user = userContextService.getCurrentUser();
            Long userId = user.getId(); // 현재 사용자의 ID를 가져옴

            // 아이템 업데이트
            itemService.update(id, itemDTO, file, imgurl, userId); // userId도 함께 전달
            // 성공적인 상품 업데이트
            ItemResponseDTO response = new ItemResponseDTO("상품이 성공적으로 업데이트되었습니다.");
            return ResponseEntity.ok(response);
        } catch (MalformedJwtException e) {
            // JWT 오류
            ItemResponseDTO response = new ItemResponseDTO("잘못된 JWT 형식입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (RuntimeException e) {
            // 기타 오류
            ItemResponseDTO response = new ItemResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // 일반적인 오류
            ItemResponseDTO response = new ItemResponseDTO("상품 업데이트에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 상품 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ItemResponseDTO> deleteItem(@PathVariable Long id) {
        try {
            User user = userContextService.getCurrentUser();
            Long userId = user.getId(); // 현재 사용자의 ID를 가져옴

            itemService.delete(id, userId); // userId 전달
            // 성공적인 상품 삭제
            ItemResponseDTO response = new ItemResponseDTO("상품이 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (MalformedJwtException e) {
            // JWT 오류
            ItemResponseDTO response = new ItemResponseDTO("잘못된 JWT 형식입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (RuntimeException e) {
            // 기타 오류
            ItemResponseDTO response = new ItemResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // 일반적인 오류
            ItemResponseDTO response = new ItemResponseDTO("상품 삭제에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 좋아요 토글
    @PostMapping("/like/{itemId}")
    public ResponseEntity<ItemDTO> toggleItemLike(@PathVariable Long itemId) {
        try {
            // 상품 좋아요 토글 서비스 호출
            Map<String, Object> response = likeService.toggleItemLike(itemId);

            // 응답에서 좋아요 상태 및 카운트 가져오기
            boolean isLiked = (boolean) response.get("isLiked");
            int likeCount = (int) response.get("likeCount");

            // ItemDTO로 응답 반환
            ItemDTO itemDTO = itemService.getItemDetail(itemId);  // 상품 상세 정보 가져오기
            itemDTO.setLikes(likeCount);  // 새로운 좋아요 수 설정

            return ResponseEntity.ok(itemDTO);
        } catch (RuntimeException e) {
            // 상품을 찾을 수 없는 경우
            ItemDTO response = new ItemDTO();
            response.setTitle("상품을 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // 현재 로그인된 사용자에 대한 좋아요 상태반환
    @GetMapping("/likes/status")
    public ResponseEntity<Map<Long, Boolean>> getLikesStatus(
            @RequestParam List<Long> targetIds,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        // 좋아요 상태 가져오기
        Map<Long, Boolean> likeStatus = likeService.getLikeStatusWithToken(targetIds, "Item", authorization);
        return ResponseEntity.ok(likeStatus);
    }

    //검색(쇼핑몰)
    @GetMapping("/search")
    public ResponseEntity<ItemResponseDTO> searchItems(@RequestParam String keyword) {
        List<ItemDTO> searchResults = itemService.searchItemsByTitle(keyword);
        ItemResponseDTO response = new ItemResponseDTO("상품 검색 성공", searchResults);
        return ResponseEntity.ok(response);
    }
}