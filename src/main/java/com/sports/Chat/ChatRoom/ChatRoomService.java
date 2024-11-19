package com.sports.Chat.ChatRoom;

import java.util.List;
import java.util.Optional;

public interface ChatRoomService {
    ChatRoom createChatRoomWithCurrentUser(ChatRoomDto chatRoomDto);
    ChatRoom inviteUser(Long chatRoomId, Long userId);
    ChatRoom getChatRoom(Long id);
    List<ChatRoomDto> getChatRoomsForCurrentUser();


    ChatRoom acceptInvitation(Long chatRoomId, Long userId);
    ChatRoom removeInvitation(Long chatRoomId, Long userId);

}
