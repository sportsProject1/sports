package com.sports.Interface;

import com.sports.user.User;

public interface updatable<T> {
    void update(Long id, T dto, User user);
    void delete(Long id, User user);
}

