package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/shop")
public class ItemController {

    private final ItemRepository itemRepository;
    private final ItemService itemService;
    private final CategoryService categoryService;
    private final S3Service s3Service;

    @GetMapping("/list")
    public String shopList(Model m){
        List<Item> shopList = itemRepository.findAll();

        m.addAttribute("items", shopList);

        return "shopList";
    }

    @GetMapping("/post")
    public String postItem(Model model){

        model.addAttribute("categories", categoryService.getAllCategories());

        return "shopAdd";

    }


    @PostMapping("/add")
    public String addItem(String title, Integer price, String desc, String imgurl, Integer stock, @RequestParam Long categoryId){

        itemService.addItem(title, price, desc, imgurl, stock, categoryId);

        return "redirect:/shop/list";
    }

}
