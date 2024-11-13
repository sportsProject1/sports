package com.sports.Item.DTO;

import lombok.Data;

import java.util.List;

@Data
public class ItemResponseDTO {
    private String message;
    private List<ItemDTO> items;

    // 기본 생성자, message만 받을 수 있는 생성자, message와 items 둘 다 받을 수 있는 생성자
    public ItemResponseDTO(String message) {
        this.message = message;
    }

    public ItemResponseDTO(String message, List<ItemDTO> items) {
        this.message = message;
        this.items = items;
    }
}
