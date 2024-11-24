export const getTimeElapsed = (createdAt) => {
    if (!createdAt) {
        return '메시지 없음'; // 빈 값일 경우 기본값 반환
    }

    const createdTime = new Date(createdAt);
    if (isNaN(createdTime)) {
        return '유효하지 않은 날짜'; // 잘못된 날짜 형식 처리
    }

    const now = new Date();
    const diffInMs = now - createdTime;
    const diffInMinutes = Math.floor(diffInMs / 60000); // 밀리초를 분으로 변환

    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `· 약 ${diffInHours}시간 전`;
    } else {
        return createdTime.toISOString().split('T')[0]; // yyyy-MM-dd 형식 반환
    }
};
