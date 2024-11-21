package com.sports.Chat.ChatMessage;

import com.sports.Chat.ChatRoom.ChatRoom;
import com.sports.Chat.ChatRoom.ChatRoomRepository;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
        savedMessageDto.setTimestamp(savedMessage.getTimestamp()); // 메시지 생성 시간

        return savedMessageDto;
    }

    @Override
    public List<ChatMessageDto> getMessages(Long chatRoomId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp")); // 최신순 정렬
        Page<ChatMessage> chatMessages = chatMessageRepository.findByChatRoomId(chatRoomId, pageRequest);

        // 엔티티를 DTO로 변환하여 반환
        return chatMessages.getContent()
                .stream()
                .map(ChatMessageDto::fromEntity)
                .collect(Collectors.toList());
    }


}
