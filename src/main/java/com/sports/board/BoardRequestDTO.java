package com.sports.board;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BoardRequestDTO {
    private String title;       // 제목
    private String content;     // 내용
    private String imgUrl;      // 이미지 콤마구분자로 String 나열
    private Long userId;        // 작성자 ID
    private Long categoryId;    // 카테고리 ID
    private List<MultipartFile> file; // 업로드시킬 파일 리스트 받아오는 필드
    private boolean chatroom = false;
}