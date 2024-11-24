package com.sports.Chat.ChatRoom;

import lombok.Data;

import java.util.Set;

@Data
public class ChatRoomDto {
    private Long id;
    private Long boardId;
    private String roomName;
    private Set<Long> createdUser;


}