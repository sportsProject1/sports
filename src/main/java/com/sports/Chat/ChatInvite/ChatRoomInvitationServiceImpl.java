package com.sports.Chat.ChatInvite;

import com.sports.Chat.ChatRoom.ChatRoom;
import com.sports.Chat.ChatRoom.ChatRoomRepository;
import com.sports.user.entito.User;
import com.sports.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatRoomInvitationServiceImpl implements ChatRoomInvitationService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ChatRoomInvitationRepository chatRoomInvitationRepository;

    private ChatRoomInvitationDto convertToChatRoomDto(ChatRoomInvitation invitation) {
        ChatRoomInvitationDto dto = new ChatRoomInvitationDto();
        dto.setId(invitation.getId());
        dto.setChatRoomId(invitation.getChatRoom().getId());
        dto.setUserId(invitation.getUser().getId());
        dto.setStatus(invitation.getStatus().name());
        dto.setRoomName(invitation.getChatRoom().getRoomName()); // roomName 설정 추가
        dto.setBoardId(invitation.getChatRoom().getBoard().getId()); // boardId 추가
        return dto;
    }

    @Override
    public List<ChatRoomInvitationDto> getUserInvitations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        List<ChatRoomInvitation> invitations = chatRoomInvitationRepository.findByUser(user);

        return invitations.stream()
                .map(this::convertToChatRoomDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<ChatRoomInvitationDto> inviteUser(Long chatRoomId, Long userId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                    .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            Optional<ChatRoomInvitation> existingInvitation = chatRoomInvitationRepository.findByChatRoomAndUser(chatRoom, user);
            if (existingInvitation.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }

            ChatRoomInvitation invitation = new ChatRoomInvitation();
            invitation.setChatRoom(chatRoom);
            invitation.setUser(user);
            invitation.setStatus(ChatRoomInvitation.InvitationStatus.PENDING);
            chatRoomInvitationRepository.save(invitation);

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToChatRoomDto(invitation));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Override
    public ResponseEntity<ChatRoomInvitationDto> acceptInvitation(Long chatRoomId, Long userId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                    .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            ChatRoomInvitation invitation = chatRoomInvitationRepository.findByChatRoomAndUser(chatRoom, user)
                    .orElseThrow(() -> new RuntimeException("초대를 찾을 수 없습니다."));

            invitation.setStatus(ChatRoomInvitation.InvitationStatus.ACCEPTED);
            chatRoomInvitationRepository.save(invitation);

            chatRoom.getCreatedUser().add(user);
            chatRoomRepository.save(chatRoom);

            return ResponseEntity.ok(convertToChatRoomDto(invitation));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Override
    public ResponseEntity<ChatRoomInvitationDto> removeInvitation(Long chatRoomId, Long userId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                    .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            ChatRoomInvitation invitation = chatRoomInvitationRepository.findByChatRoomAndUser(chatRoom, user)
                    .orElseThrow(() -> new RuntimeException("초대를 찾을 수 없습니다."));

            invitation.setStatus(ChatRoomInvitation.InvitationStatus.REJECTED);
            chatRoomInvitationRepository.save(invitation);
            chatRoomInvitationRepository.delete(invitation);

            ChatRoomInvitationDto invitationDto = convertToChatRoomDto(invitation);
            invitationDto.setStatus("DELETED"); // 상태를 DELETED로 설정

            return ResponseEntity.ok(invitationDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
