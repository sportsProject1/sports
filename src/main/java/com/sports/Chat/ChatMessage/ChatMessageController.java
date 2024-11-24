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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final UserContextService userContextService;
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chatRoom/sendMessage")
    public void sendMessage(ChatMessageDto messageDto) {
        // 메시지 저장
        ChatMessageDto savedMessage = chatMessageService.saveMessage(messageDto);

        // 동적으로 채팅방 경로에 메시지 전송
        String destination = String.format("/topic/chat/chatRoom/%d", messageDto.getChatRoomId());
        messagingTemplate.convertAndSend(destination, savedMessage);
    }

    @GetMapping("/{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessages(
            @PathVariable Long chatRoomId,
            @RequestParam int page,
            @RequestParam int size
    ) {
        List<ChatMessageDto> messages = chatMessageService.getMessages(chatRoomId, page, size);
        return ResponseEntity.ok(messages); // Spring Boot가 자동으로 JSON 배열로 변환
    }

    @GetMapping("/{chatRoomId}/lastMessageTimestamp")
    public ResponseEntity<LocalDateTime> getLastMessageTimestamp(@PathVariable Long chatRoomId) {
        return chatMessageService.getLastMessageTimestamp(chatRoomId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
