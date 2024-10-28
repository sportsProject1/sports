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
    private Item item;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1); // 예시로 설정
        item = new Item();
        item.setId(1L);
        item.setUser(user);
    }

    @Test
    void testUpdateItem() {
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setTitle("Updated Title");
        itemDTO.setPrice(150);
        itemDTO.setDesc("Updated Description");
        itemDTO.setStock(5);
        itemDTO.setCategoryId(1L);

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(categoryService.findById(1L)).thenReturn(Optional.of(new Category()));

        itemService.update(1L, itemDTO, user);

        assertEquals("Updated Title", item.getTitle());
        verify(itemRepository, times(1)).save(item);
    }

    @Test
    void testUpdateItemUnauthorized() {
        User anotherUser = new User();
        anotherUser.setId(2); // 다른 사용자

        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setTitle("Updated Title");

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            itemService.update(1L, itemDTO, anotherUser);
        });

        assertEquals("권한이 없습니다.", thrown.getMessage());
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
        anotherUser.setId(2); // 다른 사용자

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            itemService.delete(1L, anotherUser);
        });

        assertEquals("권한이 없습니다.", thrown.getMessage());
    }
}