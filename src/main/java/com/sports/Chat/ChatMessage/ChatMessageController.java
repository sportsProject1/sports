package com.sports.Chat.ChatMessage;

import com.sports.Chat.ChatRoom.ChatRoomService;
import com.sports.user.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final UserContextService userContextService;

    @MessageMapping("/chatRoom/sendMessage") // 클라이언트가 메시지 전송
    @SendTo("/topic/chat/chatRoom/{chatRoomId}") // 특정 채팅방 구독자에게 메시지 전달
    public ChatMessageDto sendMessage(ChatMessageDto messageDto) {
        return chatMessageService.saveMessage(messageDto);
    }
}
