package com.sports.Chat.ChatInvite;

import com.sports.Chat.ChatRoom.ChatRoom;
import com.sports.user.entito.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomInvitationRepository extends JpaRepository<ChatRoomInvitation, Long> {
    Optional<ChatRoomInvitation> findByChatRoomAndUser(ChatRoom chatRoom, User user);

    List<ChatRoomInvitation> findByUser(User user);
}
