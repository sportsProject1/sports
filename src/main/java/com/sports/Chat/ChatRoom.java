package com.sports.Chat;

import com.sports.user.entito.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
public class ChatRoom {
// 채팅 방에 관한 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToMany
    @JoinTable(
            name = "chat_room_users",
            joinColumns = @JoinColumn(name = "chat_room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users;

    private String roomName;



}
