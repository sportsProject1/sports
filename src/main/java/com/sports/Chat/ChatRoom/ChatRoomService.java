package com.sports.Chat.ChatRoom;

public interface ChatRoomService {
    ChatRoom createChatRoom(ChatRoomDto chatRoomDto);
    ChatRoom inviteUser(Long chatRoomId, Long userId);
    ChatRoom getChatRoom(Long id);
}
