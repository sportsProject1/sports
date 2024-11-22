package com.sports.Chat.ChatMessage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private Long id; // 메시지 ID
    private Long chatRoomId; // 채팅방 ID
    private Long senderId; // 보낸 사용자 ID
    private String senderName; // 보낸 사용자 이름
    private String content; // 메시지 내용
    private LocalDateTime timestamp; // 메시지 생성 시간

    // 엔티티를 DTO로 변환하는 메소드
    public static ChatMessageDto fromEntity(ChatMessage chatMessage) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(chatMessage.getId());
        dto.setChatRoomId(chatMessage.getChatRoom().getId());
        dto.setSenderId(chatMessage.getSender().getId());
        dto.setSenderName(chatMessage.getSender().getUsername());
        dto.setContent(chatMessage.getContent());
        dto.setTimestamp(chatMessage.getTimestamp());
        return dto;
    }
}
