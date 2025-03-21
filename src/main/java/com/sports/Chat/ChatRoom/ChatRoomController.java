package com.sports.Chat.ChatRoom;

import com.sports.Chat.ChatInvite.InviteUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;


    @GetMapping("/chat/wss/iframe.html")
    public ResponseEntity<String> handleIframeRequest() {
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body("<!DOCTYPE html><html><body>Iframe placeholder</body></html>");
    }

    @PostMapping("/create")
    public ChatRoomDto createChatRoom(@RequestBody ChatRoomDto chatRoomDto) {
        return chatRoomService.createChatRoomWithCurrentUser(chatRoomDto);
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
