package com.sports.Chat.ChatRoom;

public interface ChatRoomService {
    ChatRoom createChatRoomWithCurrentUser(ChatRoomDto chatRoomDto);
    ChatRoom inviteUser(Long chatRoomId, Long userId);
    ChatRoom getChatRoom(Long id);
}
