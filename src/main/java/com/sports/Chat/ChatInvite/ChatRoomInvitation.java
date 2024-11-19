package com.sports.Chat.ChatInvite;

import com.sports.Chat.ChatRoom.ChatRoom;
import com.sports.user.entito.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ChatRoomInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InvitationStatus status;

    public enum InvitationStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}
