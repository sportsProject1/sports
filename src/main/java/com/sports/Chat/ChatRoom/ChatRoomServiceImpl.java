package com.sports.Chat.ChatRoom;

import com.sports.Chat.ChatInvite.ChatRoomInvitation;
import com.sports.Chat.ChatInvite.ChatRoomInvitationRepository;
import com.sports.board.Board;
import com.sports.board.BoardRepository;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import com.sports.user.service.UserContextService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatRoomServiceImpl implements ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final UserContextService userContextService;
    private final ChatRoomInvitationRepository chatRoomInvitationRepository;

    @Override
    public ChatRoomDto createChatRoomWithCurrentUser(ChatRoomDto chatRoomDto) {
        Optional<Board> boardOptional = boardRepository.findById(chatRoomDto.getBoardId());
        if (boardOptional.isEmpty()) {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }

        Board board = boardOptional.get();

        // 이미 이 게시글에 대한 채팅방이 있는지 확인
        Optional<ChatRoom> existingChatRoom = chatRoomRepository.findByBoardId(board.getId());
        if (existingChatRoom.isPresent()) {
            throw new RuntimeException("이미 해당 게시글에 대한 채팅방이 존재합니다.");
        }

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setBoard(board);
        chatRoom.setRoomName(chatRoomDto.getRoomName());

        Long currentUserId = userContextService.getCurrentUserId();
        Optional<User> userOptional = userRepository.findById(currentUserId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

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

        // 초대가 이미 존재하는지 확인
        Optional<ChatRoomInvitation> existingInvitation = chatRoomInvitationRepository.findByChatRoomAndUser(chatRoom, user);
        if (existingInvitation.isPresent()) {
            throw new RuntimeException("해당 사용자에게 이미 초대가 전송되었습니다.");
        }

        // 초대 생성
        ChatRoomInvitation invitation = new ChatRoomInvitation();
        invitation.setChatRoom(chatRoom);
        invitation.setUser(user);
        invitation.setStatus(ChatRoomInvitation.InvitationStatus.PENDING);
        chatRoomInvitationRepository.save(invitation);

        return chatRoom;
    }

    @Override
    public ChatRoom acceptInvitation(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = getChatRoomById(chatRoomId);
        User user = getUserById(userId);

        // 초대 확인 및 상태 변경
        ChatRoomInvitation invitation = chatRoomInvitationRepository.findByChatRoomAndUser(chatRoom, user)
                .orElseThrow(() -> new RuntimeException("초대를 찾을 수 없습니다."));
        if (invitation.getStatus() != ChatRoomInvitation.InvitationStatus.PENDING) {
            throw new RuntimeException("이 초대는 이미 처리되었습니다.");
        }

        invitation.setStatus(ChatRoomInvitation.InvitationStatus.ACCEPTED);
        chatRoomInvitationRepository.save(invitation);

        // 채팅방에 유저 추가
        chatRoom.getCreatedUser().add(user);
        return chatRoomRepository.save(chatRoom);
    }

    @Override
    public ChatRoom removeInvitation(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = getChatRoomById(chatRoomId);
        User user = getUserById(userId);

        ChatRoomInvitation invitation = chatRoomInvitationRepository.findByChatRoomAndUser(chatRoom, user)
                .orElseThrow(() -> new RuntimeException("초대를 찾을 수 없습니다."));
        if (invitation.getStatus() != ChatRoomInvitation.InvitationStatus.PENDING) {
            throw new RuntimeException("이 초대는 이미 처리되었습니다.");
        }
        invitation.setStatus(ChatRoomInvitation.InvitationStatus.REJECTED);
        chatRoomInvitationRepository.save(invitation); // 상태 업데이트 후 저장

        // chatRoom을 반환
        return chatRoom;
    }

    @Override
    public ChatRoom getChatRoom(Long id) {
        return chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
    }

    @Override
    public List<ChatRoomDto> getChatRoomsForCurrentUser() {
        Long currentUserId = userContextService.getCurrentUserId(); // 현재 사용자 ID 가져오기
        List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByUserId(currentUserId);
        return chatRooms.stream()
                .map(chatRoom -> {
                    ChatRoomDto dto = new ChatRoomDto();
                    dto.setId(chatRoom.getId());
                    dto.setRoomName(chatRoom.getRoomName());
                    dto.setBoardId(chatRoom.getBoard().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private ChatRoom getChatRoomById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }
}
