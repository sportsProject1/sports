package com.sports.Chat.ChatMessage;

import org.springframework.data.domain.Page;

import java.util.List;

public interface ChatMessageService {
    ChatMessageDto saveMessage(ChatMessageDto messageDto);
    List<ChatMessageDto> getMessages(Long chatRoomId, int page, int size);
}
