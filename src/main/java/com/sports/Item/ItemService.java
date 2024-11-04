package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryService;
import com.sports.Interface.updatable;
import com.sports.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryService categoryService;
    private final S3Service s3Service;

    @Transactional
    public void addItem(ItemDTO itemDTO, List<MultipartFile> files, User user) throws IOException {
        Item item = new Item();

        item.setTitle(itemDTO.getTitle());
        item.setPrice(itemDTO.getPrice());
        item.setDesc(itemDTO.getDesc());
        item.setStock(itemDTO.getStock());
        item.setUser(user);

        // 이미지를 S3에 업로드 후 URL 리스트 생성
        List<String> imgUrls = s3Service.saveFiles(files);
        item.setImgurl(String.join(",", imgUrls)); // URL을 쉼표로 구분하여 저장

        Category category = categoryService.findById(itemDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
        item.setCategory(category);

        itemRepository.save(item);
    }

    public ItemDTO getItemDetail(Long id) {
        Item item = getItemEntity(id);
        return convertToDTO(item);
    }

    public Item getItemEntity(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));
    }

    private ItemDTO convertToDTO(Item item) {
        return new ItemDTO(
                item.getId(),
                item.getTitle(),
                item.getPrice(),
                item.getDesc(),
                item.getImgurl(),
                item.getStock(),
                item.getCategory() != null ? item.getCategory().getId() : null
        );
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or @userService.findByUsername(authentication.name).id == #user.id")
    public void update(Long id, ItemDTO dto, List<MultipartFile> files, User user) throws IOException {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));

        item.setTitle(dto.getTitle());
        item.setPrice(dto.getPrice());
        item.setDesc(dto.getDesc());
        item.setStock(dto.getStock());

        Category category = categoryService.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
        item.setCategory(category);

        // 이미지 파일 처리
        if (files != null && !files.isEmpty()) {
            List<String> imgUrls = s3Service.saveFiles(files);
            item.setImgurl(String.join(",", imgUrls)); // 새로운 이미지 URL로 업데이트
        }
        // 파일이 없으면 기존 이미지 URL을 그대로 유지

        itemRepository.save(item); // 업데이트된 아이템 저장
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or @userService.findByUsername(authentication.name).id == #user.id")
    public void delete(Long id, User user) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));

        itemRepository.delete(item);
    }

    public Item findById(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다.")); // 예외 처리
    }

}
