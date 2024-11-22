package com.sports.Chat.ChatMessage;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // 채팅방 ID를 기준으로 메시지 조회 (페이징 지원)
    Page<ChatMessage> findByChatRoomId(Long chatRoomId, Pageable pageable);

}
