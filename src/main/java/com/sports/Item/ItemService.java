package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryService categoryService;

    public void addItem(String title, Integer price, String desc, String imgurl, Integer stock, Long categoryId){

        Item item = new Item();

        item.setTitle(title);
        item.setPrice(price);
        item.setDesc(desc);
        item.setImgurl(imgurl);
        item.setStock(stock);

        Category category = categoryService.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        item.setCategory(category);

        itemRepository.save(item);

    }
}
