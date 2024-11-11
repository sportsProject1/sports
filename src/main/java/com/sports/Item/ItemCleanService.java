package com.sports.Item;

import com.sports.Cart.CartRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemCleanService {

    private final ItemRepository itemRepository;
    private final CartRepository cartRepository;

    // 삭제 대기 상태 상품과 해당 상품이 담긴 장바구니 항목을 3일 후 삭제하는 메서드
    @Scheduled(cron = "0 0 0 * * *")  // 매일 자정에 실행
    @Transactional
    public void autoDeleteExpiredItems() {
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime threshold = now.minusDays(3); // 3일 전 시간 계산

            // 삭제 대기 상태인 상품들 중, 3일이 지난 상품들 찾기
            List<Item> expiredItems = itemRepository.findByIsDeletedTrueAndDeletedAtBefore(threshold);

            for (Item item : expiredItems) {
                // 해당 상품과 관련된 장바구니 항목을 삭제
                cartRepository.deleteByItemId(item.getId());

                // 상품 삭제
                itemRepository.delete(item);
            }
        } catch (Exception e) {
            throw new RuntimeException("자동 삭제 처리 중 오류가 발생했습니다.", e);
        }
    }

}
