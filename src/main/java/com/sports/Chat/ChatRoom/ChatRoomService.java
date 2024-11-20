package com.sports.Chat.ChatRoom;

import java.util.List;
import java.util.Optional;

public interface ChatRoomService {
    ChatRoomDto createChatRoomWithCurrentUser(ChatRoomDto chatRoomDto);

    ChatRoom getChatRoom(Long id);
    List<ChatRoomDto> getChatRoomsForCurrentUser();

    ChatRoomDto convertToChatRoomDto(ChatRoom chatRoom);
}
