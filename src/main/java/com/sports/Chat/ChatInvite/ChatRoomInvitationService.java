package com.sports.Chat.ChatInvite;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ChatRoomInvitationService {
    ResponseEntity<ChatRoomInvitationDto> inviteUser(Long chatRoomId, Long userId);
    ResponseEntity<ChatRoomInvitationDto> acceptInvitation(Long chatRoomId, Long userId);
    ResponseEntity<ChatRoomInvitationDto> removeInvitation(Long chatRoomId, Long userId);
    List<ChatRoomInvitationDto> getUserInvitations(Long userId);
}
