package com.sports.Chat.ChatInvite;

import lombok.Data;

@Data
public class ChatRoomInvitationDto {
    private Long id;
    private Long chatRoomId;
    private Long userId;
    private String status;
    private String roomName;
}