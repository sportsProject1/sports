package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryService;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryService categoryService;
    private final S3Service s3Service;
    private final UserRepository userRepository;

    @Transactional
    public Item addItem(ItemDTO itemDTO, List<MultipartFile> files, Long userId) throws IOException {
        // userId로 User 객체를 찾음
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Item item = new Item();
        item.setTitle(itemDTO.getTitle());
        item.setPrice(itemDTO.getPrice());
        item.setDesc(itemDTO.getDesc());
        item.setStock(itemDTO.getStock());
        item.setUserId(userId);  // userId 저장

        if (files == null) {
            files = Collections.emptyList(); // null이면 빈 리스트로 처리
        }

        // 이미지를 S3에 업로드 후 URL 리스트 생성
        String imgUrls = s3Service.saveFiles(files);
        item.setImgurl(imgUrls); // URL을 쉼표로 구분하여 저장

        Category category = categoryService.findById(itemDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
        item.setCategory(category);

        return itemRepository.save(item);  // 저장된 Item 객체 반환
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

    @PreAuthorize("hasRole('ROLE_MANAGER') or @itemRepository.findById(#id).get().userId == authentication.principal.id")
    public void update(Long id, ItemDTO dto, List<MultipartFile> files, Long userId) throws IOException {
        // userId로 User 객체를 찾음
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 상품을 찾음
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));

        // 상품 정보를 업데이트
        item.setTitle(dto.getTitle());
        item.setPrice(dto.getPrice());
        item.setDesc(dto.getDesc());
        item.setStock(dto.getStock());

        // 카테고리 업데이트
        Category category = categoryService.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
        item.setCategory(category);

        // 새 파일이 있다면 파일을 업로드하고 imgurl을 업데이트
        if (files != null && !files.isEmpty()) {
            // 파일이 업로드되었을 때
            String imgUrls = s3Service.saveFiles(files); // 파일 저장하고 URL 받기
            if (imgUrls != null && !imgUrls.isEmpty()) {
                item.setImgurl(imgUrls); // imgurl에 URL을 설정
            } else {
                throw new RuntimeException("파일 업로드에 실패했습니다.");
            }
        } else {
            // 새 파일이 없다면 기존 이미지를 유지
            if (item.getImgurl() == null || item.getImgurl().isEmpty()) {
                // 기본 이미지 URL을 설정할 수 있다면 설정
                item.setImgurl("https://mystudy5350.s3.amazonaws.com/test/222.jfif"); // 기본 이미지 URL로 설정할 수 있습니다.
            }
            // 기존 이미지를 그대로 사용
        }

        // 상품 업데이트 저장
        itemRepository.save(item);
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or @itemRepository.findById(#id).get().userId == authentication.principal.id")
    public void delete(Long id, Long userId) {
        // userId로 User 객체를 찾음
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));

        item.setDeleted(true);
        item.setDeletedAt(LocalDateTime.now());

        itemRepository.save(item);
    }

    public Item findById(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다.")); // 예외 처리
    }

}
