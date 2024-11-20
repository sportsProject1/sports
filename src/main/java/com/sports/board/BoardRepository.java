package com.sports.board;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    //제목 기준 검색
    @Query("SELECT b FROM Board b WHERE b.title LIKE %:keyword%")
    List<Board> searchByTitle(String keyword);

    // 특정 카테고리의 최신 게시글 가져오기 (id)
    @Query("SELECT b FROM Board b WHERE b.category.id = :categoryId ORDER BY b.createdAt DESC")
    List<Board> findTop5ByCategoryIdOrderByCreatedAtDesc(@Param("categoryId") Long categoryId);

    // 특정 카테고리의 최신 게시글 가져오기 (name)
    @Query("SELECT b FROM Board b WHERE b.category.name = :categoryName ORDER BY b.createdAt DESC")
    List<Board> findTop5ByCategoryNameOrderByCreatedAtDesc(@Param("categoryName") String categoryName);

    // 특정 카테고리의 최신 게시글 가져오기 (tag)
    @Query("SELECT b FROM Board b WHERE b.category.tag = :tag ORDER BY b.createdAt DESC")
    List<Board> findTop5ByCategoryTagOrderByCreatedAtDesc(@Param("tag") String tag);
}