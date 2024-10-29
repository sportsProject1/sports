//package com.sports.Cart;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.sports.Category.Category;
//import com.sports.Item.Item;
//import com.sports.Item.ItemService;
//import com.sports.Security.JwtTokenProvider;
//import com.sports.user.User;
//import com.sports.user.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.List;
//
//import static org.mockito.Mockito.*;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(CartController.class)
//@Import(JwtTokenProvider.class)
//class CartControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private JwtTokenProvider jwtTokenProvider;
//
//    @MockBean
//    private CartService cartService; // CartService를 @MockBean으로 선언
//
//    @MockBean
//    private UserService userService; // UserService를 @MockBean으로 선언
//
//    @MockBean
//    private ItemService itemService; // ItemService를 @MockBean으로 선언
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @BeforeEach
//    void setUp() {
//        // Mocking은 더 이상 필요 없으므로 생략
//    }
//
//    @Test
//    @WithMockUser
//    void getCartItems_shouldReturnCartItems() throws Exception {
//        // Given
//        String userId = "1";
//        String token = "Bearer valid_token";
//        CartDTO cartDTO = new CartDTO();
//        cartDTO.setCount(2);
//        cartDTO.setItem(new Item());
//
//        when(jwtTokenProvider.extractUserId(anyString())).thenReturn(userId);
//        when(cartService.getCartItemsByUserId(userId)).thenReturn(List.of(cartDTO));
//
//        // When & Then
//        mockMvc.perform(get("/mypage/cart")
//                        .header("Authorization", token))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8"));
//    }
//
//    @Test
//    @WithMockUser
//    void addToCart_shouldAddCartItem() throws Exception {
//        // Given
//        String token = "Bearer valid_token";
//        Long itemId = 1L;
//        Long userId = 1L;
//
//        // Item 설정
//        Item item = new Item();
//        item.setId(itemId);
//        item.setTitle("Sample Item");
//        item.setPrice(1000);
//        item.setStock(10);
//        item.setDesc("Sample description");
//
//        // User 설정
//        User user = new User();
//        user.setId(userId); // 사용자 ID 설정
//        user.setUsername("sampleUser");
//        user.setNickname("Sample Nickname"); // 닉네임 추가
//        user.setPhone("010-1234-5678"); // 전화번호 추가
//        user.setEmail("sample@example.com"); // 이메일 추가
//        user.setAddress("123 Sample Street"); // 주소 추가
//        user.setImgURL("http://example.com/profile.jpg"); // 프로필 이미지 URL 추가
//
//        // CartDTO 설정
//        CartDTO cartDTO = new CartDTO();
//        cartDTO.setCount(2);
//        cartDTO.setItem(item);
//        cartDTO.setUser(user); // Mock User 설정
//
//        // Mocking UserService
//        when(userService.findById(anyString())).thenReturn(user); // ID로 사용자 조회 시 Mocking
//
//        // CartService의 addCartItem 메소드가 호출될 때 Mock 동작 설정
//        when(cartService.addCartItem(any(CartDTO.class), anyString())).thenReturn(cartDTO);
//
//        // When & Then
//        mockMvc.perform(post("/mypage/cart/add")
//                        .header("Authorization", token)
//                        .with(csrf())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(cartDTO)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.count").value(2))
//                .andExpect(jsonPath("$.item.id").value(itemId))
//                .andExpect(jsonPath("$.item.desc").value("Sample description"))
//                .andExpect(jsonPath("$.user.id").value(userId)) // Mocked user ID 확인
//                .andExpect(jsonPath("$.user.username").value("sampleUser")) // Mocked username 확인
//                .andExpect(jsonPath("$.user.nickname").value("Sample Nickname")); // Mocked nickname 확인
//    }
//
//}
