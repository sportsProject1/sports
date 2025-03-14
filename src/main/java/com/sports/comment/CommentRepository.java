package com.sports.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBoardId(Long boardId);

    List<Comment> findByItemId(Long itemId);

    List<Comment> findByParentId(Long parentId);
}
