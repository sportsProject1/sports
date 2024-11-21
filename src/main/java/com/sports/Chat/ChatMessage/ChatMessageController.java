package com.sports.Chat.ChatMessage;

import com.sports.Chat.ChatRoom.ChatRoomService;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final UserContextService userContextService;
    private final ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chatRoom/sendMessage") // 클라이언트가 메시지 전송
    @SendTo("/topic/chat/chatRoom/{chatRoomId}") // 특정 채팅방 구독자에게 메시지 전달
    public ChatMessageDto sendMessage(ChatMessageDto messageDto) {
        return chatMessageService.saveMessage(messageDto);
    }

    @GetMapping("/{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessages(
            @PathVariable Long chatRoomId,
            @RequestParam int page,
            @RequestParam int size
    ) {
        List<ChatMessageDto> messages = chatMessageService.getMessages(chatRoomId, page, size);
        return ResponseEntity.ok(messages);
    }
}
