package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryDTO;
import com.sports.Category.CategoryService;
import com.sports.Item.DTO.ItemDTO;
import com.sports.Item.DTO.ItemResponseDTO;
import com.sports.user.entito.User;
import com.sports.user.service.UserContextService;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/shop")
public class ItemController {

    private final ItemRepository itemRepository;
    private final ItemService itemService;
    private final S3Service s3Service;
    private final UserContextService userContextService;

    // 상품 목록 조회
    @GetMapping("/list")
    public ResponseEntity<ItemResponseDTO> shopList() {
        List<Item> items = itemRepository.findAllByIsDeletedFalse();
        List<ItemDTO> itemDTOs = items.stream()
                .map(item -> new ItemDTO(
                        item.getId(),
                        item.getTitle(),
                        item.getPrice(),
                        item.getDesc(),
                        item.getImgurl(),
                        item.getStock(),
                        item.getCategory() != null ? item.getCategory().getId() : null))
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
            // 성공 시 message와 item 반환
            ItemResponseDTO response = new ItemResponseDTO("상품 조회 성공", List.of(itemDTO));
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
            @RequestParam(value = "file", required = false) List<MultipartFile> file) {
        if (id == null) {
            // 유효하지 않은 상품 ID
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ItemResponseDTO("유효하지 않은 상품 ID입니다."));
        }
        try {
            User user = userContextService.getCurrentUser();
            Long userId = user.getId(); // 현재 사용자의 ID를 가져옴

            // 아이템 업데이트
            itemService.update(id, itemDTO, file, userId); // userId도 함께 전달
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
}