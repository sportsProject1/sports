package com.sports.Category;

import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String enName;

    public CategoryDTO(Long id, String name, String enName) {
        this.id = id;
        this.name = name;
        this.enName = enName;
    }
}
