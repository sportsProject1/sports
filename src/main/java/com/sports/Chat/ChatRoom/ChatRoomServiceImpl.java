package com.sports.Chat.ChatRoom;

import com.sports.board.Board;
import com.sports.board.BoardRepository;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import com.sports.user.service.UserContextService;
import com.sports.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ChatRoomServiceImpl implements ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final UserContextService userContextService;

    @Override
    public ChatRoomDto createChatRoomWithCurrentUser(ChatRoomDto chatRoomDto) {
        Optional<Board> boardOptional = boardRepository.findById(chatRoomDto.getBoardId());
        if (boardOptional.isEmpty()) {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }

        Board board = boardOptional.get();
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setBoard(board);
        chatRoom.setRoomName(chatRoomDto.getRoomName());

        // 현재 인증된 사용자 ID 가져오기
        Long currentUserId = userContextService.getCurrentUserId();
        Optional<User> userOptional = userRepository.findById(currentUserId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        // 채팅방 생성자를 기본 참여자로 추가
        Set<User> users = new HashSet<>();
        users.add(userOptional.get());
        chatRoom.setCreatedUser(users);

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        // ChatRoom -> ChatRoomDto로 변환
        return convertToChatRoomDto(savedChatRoom);
    }

    private ChatRoomDto convertToChatRoomDto(ChatRoom chatRoom) {
        ChatRoomDto chatRoomDto = new ChatRoomDto();
        chatRoomDto.setId(chatRoom.getId());
        chatRoomDto.setRoomName(chatRoom.getRoomName());
        chatRoomDto.setBoardId(chatRoom.getBoard().getId());
        chatRoomDto.setCreatedUser(chatRoom.getCreatedUser().stream()
                .map(User::getId)
                .collect(Collectors.toSet()));
        return chatRoomDto;
    }

    @Override
    public ChatRoom inviteUser(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        chatRoom.getCreatedUser().add(user);
        return chatRoomRepository.save(chatRoom);
    }

    @Override
    public ChatRoom getChatRoom(Long id) {
        return chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
    }
}
