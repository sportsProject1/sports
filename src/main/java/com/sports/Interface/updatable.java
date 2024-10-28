package com.sports.Interface;

import com.sports.Item.ItemDTO;
import com.sports.user.User;

public interface updatable<T> {
    void update(Long id, T dto, User user);  // User 객체를 추가
    void delete(Long id, User user);          // User 객체를 추가
}

