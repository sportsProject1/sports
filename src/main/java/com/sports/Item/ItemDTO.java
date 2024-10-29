package com.sports.Item;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@RequiredArgsConstructor
public class ItemDTO {
    private Long id;

    @NotBlank
    @Size(min = 2, max = 40, message = "상품명은 2글자~40글자까지 가능합니다.")
    private String title;

    @Min(value = 1, message = "상품가격은 1원 이상이어야 합니다.")
    private Integer price;

    @NotBlank
    @Size(max = 400, message = "상품설명은 400자이하만 가능합니다.")
    private String desc;

    private String imgurl;

    @Min(value = 1, message = "상품재고는 1 이상이어야 합니다.")
    private Integer stock;

    @NotBlank
    @Size(message = "카테고리는 반드시 선택해야 합니다.")
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
