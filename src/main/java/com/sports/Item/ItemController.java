package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryDTO;
import com.sports.Category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
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
                                                    @RequestParam("file") MultipartFile file) throws IOException {
        String imgURL = s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());
        itemDTO.setImgurl(imgURL);

        itemService.addItem(itemDTO);
        ItemResponseDTO response = new ItemResponseDTO("아이템이 성공적으로 추가되었습니다.");
        return ResponseEntity.ok(response);
    }

    // 사용자 정보 가져올 방법 생기면 위에꺼 대신 사용
//    @PostMapping("/add")
//    public ResponseEntity<ItemResponseDTO> postItem(@ModelAttribute ItemDTO itemDTO,
//                                                    @RequestParam("file") MultipartFile file,
//                                                    Authentication authentication) throws IOException {
//        String imgURL = s3Service.saveFile(file.getOriginalFilename(), file.getInputStream());
//        itemDTO.setImgurl(imgURL);
//
//        int userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
//
//        itemService.addItem(itemDTO, userId);
//
//        ItemResponseDTO response = new ItemResponseDTO("아이템이 성공적으로 추가되었습니다.");
//        return ResponseEntity.ok(response);
//    }


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
