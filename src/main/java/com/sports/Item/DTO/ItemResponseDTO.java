package com.sports.Item.DTO;

import lombok.Data;

import java.util.List;

@Data
public class ItemResponseDTO {
    private String message;
    private List<ItemDTO> items;
    private ItemDTO item;

    // 기본 생성자, message만 받을 수 있는 생성자, message와 items 둘 다 받을 수 있는 생성자
    public ItemResponseDTO(String message) {
        this.message = message;
        this.items = null; // null로 초기화
    }

    public ItemResponseDTO(String message, List<ItemDTO> items) {
        this.message = message;
        this.items = items;
    }

    public ItemResponseDTO(String message, ItemDTO item) {
        this.message = message;
        this.item = item;  // 단일 아이템을 리스트로 감싸서 처리
    }
}
