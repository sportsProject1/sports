package com.sports.Chat.ChatRoom;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sports.board.Board;
import com.sports.user.entito.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "chat_room_users",
            joinColumns = @JoinColumn(name = "chat_room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> createdUser;

    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @Column(nullable = false)
    private String roomName;
}
