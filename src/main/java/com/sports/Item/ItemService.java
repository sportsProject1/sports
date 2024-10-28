package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryService;
import com.sports.Interface.updatable;
import com.sports.user.User;
import com.sports.user.UserRepository;
import com.sports.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemService implements updatable<ItemDTO> {

    private final ItemRepository itemRepository;
    private final CategoryService categoryService;
    private final UserService userService;
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
        Optional<Item> optionalItem = itemRepository.findById(id);
        if (optionalItem.isPresent()) {
            Item item = optionalItem.get();
            return new ItemDTO(
                    item.getId(),
                    item.getTitle(),
                    item.getPrice(),
                    item.getDesc(),
                    item.getImgurl(),
                    item.getStock(),
                    item.getCategory() != null ? item.getCategory().getId() : null
            );
        } else {
            return null;
        }
    }

    public Item getItemEntity(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));
    }

    @Override
    public void update(Long id, ItemDTO dto, User user) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));

        // 1차 권한 확인: 현재 로그인한 사용자의 ID와 아이템의 소유자 ID를 비교
        if (item.getUser().getId() != user.getId()) {
            // 2차 권한 확인: 로그인한 사용자가 관리자(role이 ADMIN)인지 확인
            if (!"ROLE_ADMIN".equals(user.getRole())) {
                throw new RuntimeException("권한이 없습니다.");
            }
        }

        item.setTitle(dto.getTitle());
        item.setPrice(dto.getPrice());
        item.setDesc(dto.getDesc());
        item.setStock(dto.getStock());

        Category category = categoryService.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
        item.setCategory(category);

        itemRepository.save(item);
    }

    @Override
    public void delete(Long id, User user) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));

        // 1차 권한 확인: 현재 로그인한 사용자의 ID와 아이템의 소유자 ID를 비교
        if (item.getUser().getId() != user.getId()) {
            // 2차 권한 확인: 로그인한 사용자가 관리자(role이 ADMIN)인지 확인
            if (!"ROLE_ADMIN".equals(user.getRole())) {
                throw new RuntimeException("권한이 없습니다.");
            }
        }

        itemRepository.delete(item);
    }

}
