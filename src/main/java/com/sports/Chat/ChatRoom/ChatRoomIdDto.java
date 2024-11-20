package com.sports.Chat.ChatRoom;

public class ChatRoomIdDto {
    private Long id;

    // 기본 생성자
    public ChatRoomIdDto() {}

    // 매개변수를 받는 생성자
    public ChatRoomIdDto(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}