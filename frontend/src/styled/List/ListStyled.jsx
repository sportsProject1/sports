import styled from "styled-components";

export const ListWrap = styled.div`
    width: 100%;
    border: 1px solid #e0e0e0;
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    margin-left: 30px;
`

export const PostContent = styled.div`
    position:relative;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const PostInfo = styled.div`
    font-size: 14px;
    color: gray;
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    position:relative;

    .time-ago {
        position: absolute;
        top: -110px;
        right: 0;
        font-weight: bold;
        color: white; /* 텍스트 색상 */
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
        background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(2px);
        text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5),
                     0px 0px 4px rgba(255, 255, 255, 0.3);
    }

    .details {
        position: absolute;
        right: 0;
        bottom:0;
        display: flex;
        gap: 10px;

        span {
            font-size: 12px;
            color: #555;
        }
    }
`;

export const BoardWrapperImg = styled.img`
    width: 100%;
    height: 180px;
`;
