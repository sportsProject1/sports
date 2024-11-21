package com.sports.Chat.ChatMessage;

import lombok.Data;

@Data
public class ChatMessageDto {
    private Long id;
    private Long chatRoomId;
    private Long senderId;
    private String senderName; // 사용자 이름 표시
    private String content;
    private String timestamp; // 문자열 형식의 타임스탬프
}
