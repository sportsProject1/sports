package com.sports.Chat.ChatInvite;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatRoomInvitationController {

    private final ChatRoomInvitationService chatRoomInvitationService;

    @PostMapping("/invite/{chatRoomId}")
    public ResponseEntity<ChatRoomInvitationDto> inviteUser(@PathVariable Long chatRoomId, @RequestBody InviteUserRequest request) {
        return chatRoomInvitationService.inviteUser(chatRoomId, request.getUserId());
    }

    @PostMapping("/accept/{chatRoomId}")
    public ResponseEntity<ChatRoomInvitationDto> acceptUser(@PathVariable Long chatRoomId, @RequestBody InviteUserRequest request) {
        return chatRoomInvitationService.acceptInvitation(chatRoomId, request.getUserId());
    }

    @PostMapping("/remove/{chatRoomId}")
    public ResponseEntity<ChatRoomInvitationDto> removeUser(@PathVariable Long chatRoomId, @RequestBody InviteUserRequest request) {
        return chatRoomInvitationService.removeInvitation(chatRoomId, request.getUserId());
    }

    @GetMapping("/invitations/{userId}")
    public ResponseEntity<List<ChatRoomInvitationDto>> getUserInvitations(@PathVariable Long userId) {
        List<ChatRoomInvitationDto> invitationDtos = chatRoomInvitationService.getUserInvitations(userId);
        return ResponseEntity.ok(invitationDtos);
    }
}
