package com.sports.Chat.ChatRoom;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatRoomController {
    private final ChatRoomService chatRoomService;


    @PostMapping("/create")
    public ChatRoom createChatRoom(@RequestBody ChatRoomDto chatRoomDto) {
        return chatRoomService.createChatRoomWithCurrentUser(chatRoomDto);
    }

    @PostMapping("/invite/{chatRoomId}")
    public ChatRoom inviteUser(@PathVariable Long chatRoomId, @RequestParam Long userId) {
        return chatRoomService.inviteUser(chatRoomId, userId);
    }

    @GetMapping("/{id}")
    public ChatRoom getChatRoom(@PathVariable Long id) {
        return chatRoomService.getChatRoom(id);
    }
}
