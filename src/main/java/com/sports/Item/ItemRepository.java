package com.sports.Item;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    Page<Item> findPageBy(Pageable page);

    List<Item> findAllByIsDeletedFalse();

    List<Item> findByIsDeletedTrueAndDeletedAtBefore(LocalDateTime threshold);

    @Query("SELECT i FROM Item i WHERE i.title LIKE %:keyword%")
    List<Item> searchByTitle(@Param("keyword") String keyword);
}
