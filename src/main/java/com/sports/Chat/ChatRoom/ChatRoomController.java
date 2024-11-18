package com.sports.Chat.ChatRoom;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
public class ChatRoomController {
    private final ChatRoomService chatRoomService;

    public ChatRoomController(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }

    @PostMapping("/create")
    public ChatRoom createChatRoom(@RequestBody ChatRoomDto chatRoomDto) {
        return chatRoomService.createChatRoom(chatRoomDto);
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
