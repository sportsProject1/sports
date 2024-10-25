package com.sports.Chat;

import com.sports.User.User;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Override
    public ChatRoom createChatRoom(String roomName, Set<User> users) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setRoomName(roomName);
        chatRoom.setUsers(users);
        return chatRoomRepository.save(chatRoom);
    }

    @Override
    public List<ChatMessage> getMessages(Long chatRoomId) {
        return chatMessageRepository.findByChatRoomId(chatRoomId);
    }

    @Override
    public ChatMessage sendMessage(Long chatRoomId, User sender, String content) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatRoom(chatRoomRepository.findById(chatRoomId).orElse(null));
        chatMessage.setSender(sender);
        chatMessage.setContent(content);
        chatMessage.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(chatMessage);
    }


}
