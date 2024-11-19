package com.sports.Chat.ChatRoom;

import java.util.Optional;

public interface ChatRoomService {
    ChatRoom createChatRoomWithCurrentUser(ChatRoomDto chatRoomDto);
    ChatRoom inviteUser(Long chatRoomId, Long userId);
    ChatRoom getChatRoom(Long id);

}
