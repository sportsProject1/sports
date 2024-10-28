package com.sports.Item;

import com.sports.Category.Category;
import com.sports.Category.CategoryService;
import com.sports.user.User;
import com.sports.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ItemServiceTest {

    @InjectMocks
    private ItemService itemService;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private UserService userService;

    private User user;
    private User adminUser;
    private Item item;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1); // 일반 사용자 ID
        user.setRole("ROLE_USER"); // 일반 사용자 역할

        adminUser = new User();
        adminUser.setId(2); // 관리자 사용자 ID
        adminUser.setRole("ROLE_ADMIN"); // 관리자 역할

        item = new Item();
        item.setId(1L);
        item.setUser(user);
    }

    @Test
    void testUpdateItemUnauthorized() {
        User anotherUser = new User();
        anotherUser.setId(3); // 다른 사용자

        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setTitle("Updated Title");

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            itemService.update(1L, itemDTO, anotherUser);
        });

        assertEquals("권한이 없습니다.", thrown.getMessage());
    }

    @Test
    void testUpdateItemAdmin() {
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setTitle("Updated Title");
        itemDTO.setPrice(150);
        itemDTO.setDesc("Updated Description");
        itemDTO.setStock(5);
        itemDTO.setCategoryId(1L);

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(categoryService.findById(1L)).thenReturn(Optional.of(new Category()));

        itemService.update(1L, itemDTO, adminUser); // 관리자 사용자가 업데이트

        assertEquals("Updated Title", item.getTitle());
        verify(itemRepository, times(1)).save(item);
    }

    @Test
    void testDeleteItem() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        itemService.delete(1L, user);

        verify(itemRepository, times(1)).delete(item);
    }

    @Test
    void testDeleteItemUnauthorized() {
        User anotherUser = new User();
        anotherUser.setId(3); // 다른 사용자

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            itemService.delete(1L, anotherUser);
        });

        assertEquals("권한이 없습니다.", thrown.getMessage());
    }

    @Test
    void testDeleteItemAdmin() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        itemService.delete(1L, adminUser); // 관리자 사용자가 삭제

        verify(itemRepository, times(1)).delete(item);
    }
}