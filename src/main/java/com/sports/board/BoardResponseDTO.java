package com.sports.board;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BoardResponseDTO {
    private Long id;                    // 게시글 ID
    private String title;               // 제목
    private String content;             // 내용
    private String imgUrl;              // 업로드 이미지
    private LocalDateTime createdAt;    // 작성일
    private LocalDateTime updatedAt;    // 수정일
    private int likes;                  // 좋아요 수
    private int views;                  // 조회수
    private String author;              // 작성자
    private String category;            // 게시글 카테고리
    private boolean chatroom;
    private Double latitude;            // 위도
    private Double longitude;           // 경도

//    // 메세지 반환용
//    public BoardResponseDTO(String massage) {
//        this.content = massage;
//    }
}