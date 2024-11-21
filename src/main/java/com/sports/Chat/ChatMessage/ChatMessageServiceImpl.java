package com.sports.Chat.ChatMessage;

import com.sports.Chat.ChatRoom.ChatRoom;
import com.sports.Chat.ChatRoom.ChatRoomRepository;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    @Override
    public ChatMessageDto saveMessage(ChatMessageDto messageDto) {
        ChatRoom chatRoom = chatRoomRepository.findById(messageDto.getChatRoomId())
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
        User sender = userRepository.findById(messageDto.getSenderId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setSender(sender);
        chatMessage.setContent(messageDto.getContent());
        chatMessage.setTimestamp(LocalDateTime.now());

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        ChatMessageDto savedMessageDto = new ChatMessageDto();
        savedMessageDto.setId(savedMessage.getId());
        savedMessageDto.setChatRoomId(chatRoom.getId());
        savedMessageDto.setSenderId(sender.getId());
        savedMessageDto.setSenderName(sender.getUsername()); // 사용자 이름
        savedMessageDto.setContent(savedMessage.getContent());
        savedMessageDto.setTimestamp(savedMessage.getTimestamp().toString());

        return savedMessageDto;
    }
}
