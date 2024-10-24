package com.sports.Item;

import com.sports.Category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.sports.Item.ItemDTO;

import java.util.List;
import java.util.Optional;
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

//    @GetMapping("/list")
//    public List<ItemDTO> shopList() {
//        List<Item> items = itemRepository.findAll();
//        return items.stream()
//                .map(item -> new ItemDTO(item.getId(), item.getTitle(), item.getPrice(), item.getDesc(), item.getImgurl(), item.getStock(), item.getCategory() != null ? item.getCategory().getId() : null))
//                .collect(Collectors.toList());
//    }

    @GetMapping("/list")
    String list(Model m){
        List<Item> item = itemRepository.findAll();

        m.addAttribute("items", item);

        return "list";
    }

    @GetMapping("/presigned-url")
    @ResponseBody
    String getURL(@RequestParam String filename){
        var result = s3Service.createPreSignedURL("img/" + filename);
        return result;
    }

    @GetMapping("/post")
    public String postItem(Model m){

        m.addAttribute("categories", categoryService.getAllCategories());

        return "shopAdd";

    }

    @PostMapping("/add")
    public String addItem(String title, Integer price, String desc, String imgurl, Integer stock, @RequestParam Long categoryId){

        itemService.addItem(title, price, desc, imgurl, stock, categoryId);

        return "redirect:/shop/list";
    }

    @GetMapping("/detail/{id}")
    String detailItem(@PathVariable Long id, Model m){
        Optional<Item> item = itemRepository.findById(id);

        m.addAttribute("data", item.get());

        return "shopDetail";
    }

}
