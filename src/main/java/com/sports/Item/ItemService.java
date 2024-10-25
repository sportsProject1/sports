package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryService;
import com.sports.Interface.updatable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemService implements updatable<ItemDTO> {

    private final ItemRepository itemRepository;
    private final CategoryService categoryService;

    public void addItem(ItemDTO itemDTO) {
        Item item = new Item();

        item.setTitle(itemDTO.getTitle());
        item.setPrice(itemDTO.getPrice());
        item.setDesc(itemDTO.getDesc());
        item.setImgurl(itemDTO.getImgurl());
        item.setStock(itemDTO.getStock());

        Category category = categoryService.findById(itemDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

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

    @Override
    public void update(Long id, ItemDTO itemDTO) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setTitle(itemDTO.getTitle());
        item.setPrice(itemDTO.getPrice());
        item.setDesc(itemDTO.getDesc());
        item.setImgurl(itemDTO.getImgurl());
        item.setStock(itemDTO.getStock());

        Category category = categoryService.findById(itemDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        item.setCategory(category);
        itemRepository.save(item);
    }

    @Override
    public void delete(Long id) {
        itemRepository.deleteById(id);
    }
}
