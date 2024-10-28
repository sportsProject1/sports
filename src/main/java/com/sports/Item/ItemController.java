package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryDTO;
import com.sports.Category.CategoryService;
import com.sports.Security.JwtTokenProvider;
import com.sports.user.User;
import com.sports.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
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
                                                    @RequestHeader("Authorization") String token) throws IOException {
        String userId = jwtTokenProvider.extractUserId(token.replace("Bearer ", ""));

        User user = userService.findByUsername(userId)
                        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        itemService.addItem(itemDTO, file, user); // 파일을 함께 전달
        ItemResponseDTO response = new ItemResponseDTO("아이템이 성공적으로 추가되었습니다.");
        return ResponseEntity.ok(response);
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
    public ResponseEntity<Void> updateItem(@PathVariable Long id, @RequestBody ItemDTO itemDTO) {
        itemService.update(id, itemDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.delete(id);
        return ResponseEntity.ok().build();
    }

}
