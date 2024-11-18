package com.sports.board;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    //제목 기준 검색
    @Query("SELECT b FROM Board b WHERE b.title LIKE %:keyword%")
    List<Board> searchByTitle(String keyword);
}
