package com.sports.Chat.ChatRoom;

import lombok.Data;

import java.util.Set;

@Data
public class ChatRoomDto {
    private Long id;
    private Long boardId;
    private String roomName;
    private Set<Long> createdUser; // 채팅방에 참가하는 사용자 ID 목록
}
