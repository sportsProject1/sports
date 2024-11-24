package com.sports.Chat.ChatMessage;

import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ChatMessageService {
    ChatMessageDto saveMessage(ChatMessageDto messageDto);
    List<ChatMessageDto> getMessages(Long chatRoomId, int page, int size);
    Optional<LocalDateTime> getLastMessageTimestamp(Long chatRoomId);
}
