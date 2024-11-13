package com.sports.Comment.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDTO {
    private String message;
    private List<CommentDTO> commentItems;
}
