export const getTimeElapsed = (createdAt) => {
    if(!createdAt){
        return "메세지가 없습니다."
    }
    const createdTime = new Date(createdAt);

    // UTC를 한국 시간(Asia/Seoul)으로 변환
    const utcTime = createdTime.toISOString();  // DB에서 받은 시간을 ISO 형식으로 변환
    const createdTimeInKST = new Date(utcTime);  // 해당 UTC 시간을 새로 Date 객체로 생성

    // UTC 시간을 한국 시간대로 변환 (KST)
    const timeZoneOffset = 9 * 60; // 한국 시간대는 UTC+9
    createdTimeInKST.setMinutes(createdTimeInKST.getMinutes() + timeZoneOffset);  // 타임존 보정

    const now = new Date(); // 현재 시간을 가져옴
    const nowInKST = new Date(now.getTime() + timeZoneOffset); // 현재 시간도 한국 시간대로 보정

    // 시간 차이 계산 (밀리초 단위)
    const diffInMs = nowInKST - createdTimeInKST;
    const diffInMinutes = Math.floor(diffInMs / 60000); // 밀리초를 분으로 변환

    // 시간 차이에 따른 출력
    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `약 ${diffInHours}시간 전`;
    } else {
        const diffInDays = Math.floor(diffInMinutes / 1440);
        return `${diffInDays}일 전`;
    }
};