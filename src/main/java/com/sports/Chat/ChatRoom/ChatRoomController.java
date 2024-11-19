package com.sports.Chat.ChatRoom;

import com.sports.Chat.ChatInvite.InviteUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ChatRoom inviteUser(@PathVariable Long chatRoomId, @RequestBody InviteUserRequest request) {
        return chatRoomService.inviteUser(chatRoomId, request.getUserId());
    }

    @PostMapping("/accept/{chatRoomId}")
    public ChatRoom acceptInvitation(@PathVariable Long chatRoomId, @RequestBody Long userId) {
        return chatRoomService.acceptInvitation(chatRoomId, userId);
    }

    @PostMapping("/remove/{chatRoomId}")
    public ChatRoom removeInvitation(@PathVariable Long chatRoomId, @RequestBody Long userId) {
        return chatRoomService.removeInvitation(chatRoomId, userId);
    }

    @GetMapping("/{id}")
    public ChatRoom getChatRoom(@PathVariable Long id) {
        return chatRoomService.getChatRoom(id);
    }

    @GetMapping("/my-rooms")
    public List<ChatRoomDto> getMyChatRooms() {
        return chatRoomService.getChatRoomsForCurrentUser();
    }
}
