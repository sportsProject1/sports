package com.sports.board;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardRequestDTO {
    private String title;       // 제목
    private String content;     // 내용
    private String imgUrl;      // 이미지
    private Long userId;        // 작성자 ID
    private Long categoryId;    // 카테고리 ID
    private List<MultipartFile> file; // 업로드된 파일 리스트
}