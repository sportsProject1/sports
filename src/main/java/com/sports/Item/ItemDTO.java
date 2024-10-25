package com.sports.Item;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@RequiredArgsConstructor
public class ItemDTO {
    private Long id;
    private String title;
    private Integer price;
    private String desc;
    private String imgurl;
    private Integer stock;
    private Long categoryId;
    private List<MultipartFile> files;

    public ItemDTO(Long id, String title, Integer price, String desc, String imgurl, Integer stock, Long categoryId) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.desc = desc;
        this.imgurl = imgurl;
        this.stock = stock;
        this.categoryId = categoryId;
    }

}
