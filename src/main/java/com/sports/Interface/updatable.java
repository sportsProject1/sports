package com.sports.Interface;

import com.sports.Item.ItemDTO;

public interface updatable<T> {
    void update(Long id, T dto);
    void delete(Long id);
}
