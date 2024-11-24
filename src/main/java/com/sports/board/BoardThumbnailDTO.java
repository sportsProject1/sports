package com.sports.board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoardThumbnailDTO {
    private Long boardId;
    private String thumbnailUrl;
}
