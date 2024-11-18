package com.sports.Chat.ChatRoom;

import com.sports.board.Board;
import com.sports.board.BoardRepository;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Override
    public ChatRoom createChatRoom(ChatRoomDto chatRoomDto) {
        Optional<Board> boardOptional = boardRepository.findById(chatRoomDto.getBoardId());
        if (boardOptional.isEmpty()) {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }

        Board board = boardOptional.get();
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setBoard(board);
        chatRoom.setRoomName(chatRoomDto.getRoomName());

        if (chatRoomDto.getCreatedUser() != null && !chatRoomDto.getCreatedUser().isEmpty()) {
            Set<User> users = new HashSet<>();
            for (Long userId : chatRoomDto.getCreatedUser()) {
                Optional<User> userOptional = userRepository.findById(userId);
                userOptional.ifPresent(users::add);
            }
            chatRoom.setCreatedUser(users);
        }

        return chatRoomRepository.save(chatRoom);
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
