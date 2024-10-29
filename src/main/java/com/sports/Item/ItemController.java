package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryDTO;
import com.sports.Category.CategoryService;
import com.sports.Security.JwtTokenProvider;
import com.sports.user.User;
import com.sports.user.UserService;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final CategoryService categoryService;
    private final S3Service s3Service;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public List<ItemDTO> shopList() {
        List<Item> items = itemRepository.findAll();
        return items.stream()
                .map(item -> new ItemDTO(
                        item.getId(),
                        item.getTitle(),
                        item.getPrice(),
                        item.getDesc(),
                        item.getImgurl(),
                        item.getStock(),
                        item.getCategory() != null ? item.getCategory().getId() : null))
                .collect(Collectors.toList());
    }

    @GetMapping("/presigned-url")
    @ResponseBody
    String getURL(@RequestParam(name = "filename") String filename) {
        return s3Service.createPreSignedURL("img/" + filename);
    }

    @GetMapping("/post")
    public List<CategoryDTO> getCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return categories.stream()
                .map(category -> new CategoryDTO(category.getId(), category.getName()))
                .collect(Collectors.toList());
    }

    @PostMapping("/add")
    public ResponseEntity<ItemResponseDTO> postItem(@ModelAttribute ItemDTO itemDTO,
                                                    @RequestParam("file") List<MultipartFile> file,
                                                    @RequestHeader("Authorization") String token) {
        try {
            String userId = jwtTokenProvider.extractUserId(token.replace("Bearer ", ""));
            User user = userService.findByUsername(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            itemService.addItem(itemDTO, file, user); // 파일을 함께 전달
            ItemResponseDTO response = new ItemResponseDTO("상품이 성공적으로 추가되었습니다.");
            return ResponseEntity.ok(response);
        } catch (MalformedJwtException e) {
            // JWT가 잘못된 형식인 경우
            ItemResponseDTO response = new ItemResponseDTO("잘못된 JWT 형식입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (IOException e) {
            // 파일 처리 중 오류 발생
            ItemResponseDTO response = new ItemResponseDTO("상품 추가 중 파일 처리에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (RuntimeException e) {
            // 사용자 찾기 실패 등 일반 예외 처리
            ItemResponseDTO response = new ItemResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // 그 외의 예외 처리
            ItemResponseDTO response = new ItemResponseDTO("상품 추가에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<ItemDTO> detailItem(@PathVariable Long id) {
        ItemDTO itemDTO = itemService.getItemDetail(id);

        if (itemDTO != null) {
            return ResponseEntity.ok(itemDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<ItemResponseDTO> updateItem(
            @PathVariable Long id,
            @RequestBody ItemDTO itemDTO,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = jwtTokenProvider.extractUserId(token.replace("Bearer ", ""));
            User user = userService.findByUsername(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            itemService.update(id, itemDTO, user);
            ItemResponseDTO response = new ItemResponseDTO("상품이 성공적으로 업데이트되었습니다.");
            return ResponseEntity.ok(response);
        } catch (MalformedJwtException e) {
            ItemResponseDTO response = new ItemResponseDTO("잘못된 JWT 형식입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (RuntimeException e) {
            ItemResponseDTO response = new ItemResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            ItemResponseDTO response = new ItemResponseDTO("상품 업데이트에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ItemResponseDTO> deleteItem(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = jwtTokenProvider.extractUserId(token.replace("Bearer ", ""));
            User user = userService.findByUsername(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            itemService.delete(id, user);
            ItemResponseDTO response = new ItemResponseDTO("상품이 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (MalformedJwtException e) {
            ItemResponseDTO response = new ItemResponseDTO("잘못된 JWT 형식입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (RuntimeException e) {
            ItemResponseDTO response = new ItemResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            ItemResponseDTO response = new ItemResponseDTO("상품 삭제에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
