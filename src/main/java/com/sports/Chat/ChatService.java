package com.sports.Chat;

import com.sports.User.User;

import java.util.List;
import java.util.Set;

public interface ChatService {

    ChatRoom createChatRoom(String roomName, Set<User>users);


    List<ChatMessage>getMessages(Long chatRoomId);


    ChatMessage sendMessage(Long chatRoomId, User sender, String content);
}
