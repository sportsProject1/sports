import styled from "styled-components";

export const ListWrap = styled.div`
    width: 60%;
    border: 1px solid #e0e0e0;
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    margin-left: 30px;

    @media (max-width: 1024px) {
        width: 80%; /* 화면이 작아지면 너비 증가 */
        margin-left: 10px;
    }

    @media (max-width: 768px) {
        width: 100%; /* 모바일에서는 전체 너비 */
        margin-left: 0;
    }
`;

export const PostContent = styled.div`
    position: relative;
    padding: 13px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    @media (max-width: 768px) {
        padding: 12px; /* 모바일에서는 여백 축소 */
        gap: 3px;
    }
`;

export const PostInfo = styled.div`
    font-size: 14px;
    color: gray;
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    position: relative;

    .time-ago {
        position: absolute;
        top: -103px;
        right: 0;
        font-weight: bold;
        color: white;
        font-size: 11px;
        padding: 4px 6px;
        border-radius: 11px;
        background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(2px);
        text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5), 0px 0px 4px rgba(255, 255, 255, 0.3);

        @media (max-width: 768px) {
            font-size: 10px; /* 모바일에서는 텍스트 크기 감소 */
            padding: 3px 6px;
            top: -90px; /* 위치 조정 */
        }
    }

    .details {
        position: absolute;
        right: 0;
        bottom: 0;
        display: flex;
        gap: 10px;

        span {
            font-size: 12px;
            color: #555;

            @media (max-width: 768px) {
                font-size: 10px; /* 모바일에서는 텍스트 크기 감소 */
            }
        }
    }
`;

export const BoardWrapperImg = styled.img`
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;

    @media (max-width: 768px) {
        height: 140px; /* 모바일에서는 이미지 높이 축소 */
    }

    @media (max-width: 480px) {
        height: 100px; /* 더 작은 화면에서는 이미지 높이 축소 */
    }
`;
