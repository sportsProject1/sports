package com.sports.Chat.ChatRoom;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    @Transactional
    @Modifying
    @Query("DELETE FROM ChatRoom c WHERE c.board.id = :boardId")
    void deleteByBoardId(Long boardId);


    // 특정 boardId를 기준으로 ChatRoom을 찾는 메서드
    Optional<ChatRoom> findByBoardId(Long boardId);
}
