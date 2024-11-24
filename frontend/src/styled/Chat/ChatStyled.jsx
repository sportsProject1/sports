import styled from 'styled-components';

// 전체 컨테이너
export const ChatAppContainer = styled.div`
    display: flex;
    width: 60%;
    height: 600px;
    margin: auto;
    background-color: #f0f0f0;
    margin-top:15px
`;

// 좌측 사이드바
export const Sidebar = styled.div`
    width: 20%;
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding: 20px;
    margin-right: 25px;
`;

// 좌측 메뉴 항목
export const SidebarItem = styled.div`
    padding: 10px 15px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 5px;
    background-color: #F0F4FF;
    transition: background-color 0.3s;
    color: black;
    width: 100%;
    font-size: 0.9rem;

    &:hover {
        background-color: ${({ theme }) => theme.colors.secondary};
    }
`;

// 초대/채팅방 리스트
export const ListContainer = styled.div`
    flex: 1;
    width: 100%;
    padding: 10px;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid #e0e0e0;
    border-radius: 8px;

    /* Scrollbar 스타일링 */
    &::-webkit-scrollbar {
        width: 8px; /* 스크롤바 너비 */
    }

    &::-webkit-scrollbar-track {
        background: #f0f0f0; /* 스크롤바 트랙 색상 */
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: #cccccc; /* 스크롤바 핸들 색상 */
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #aaaaaa; /* 스크롤바 핸들 색상 (호버 시) */
    }
`;

export const ChatRoomItem = styled.div`
    width: 100%;
    height: 100px;
    background-color: #F0F4FF;
    margin-bottom: 15px;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    div:first-child{
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    img{
        height: 100%;
        border-radius: 15px;
        margin-right: 15px;
    }
`
export const ChatRoomItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    p:last-child{
        cursor: pointer;
        display: flex;
    }
`
export const InviteButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    button{
        padding: 0.5rem 1rem;
        background-color: ${({ theme }) => theme.colors.error};
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 15px;
    }
    button:first-child{
        background-color: ${({ theme }) => theme.colors.primary};
    }
`

// 우측 메인 컨테이너
export const MainContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    
`;


export const ChatRoomContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`
export const ChatHeader = styled.div`
    flex-grow: 1;
    background-color: ${({ theme }) => theme.colors.primary};
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    h1{
        font-size: 1.5rem;
        padding: 10px;
    }
`;
export const ChatHistory = styled.div`
    flex-grow: 8.5;
    padding: 20px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap:10px;
    /* Scrollbar 스타일링 */
    &::-webkit-scrollbar {
        width: 8px; /* 스크롤바 너비 */
    }

    &::-webkit-scrollbar-track {
        background: #f0f0f0; /* 스크롤바 트랙 색상 */
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: #cccccc; /* 스크롤바 핸들 색상 */
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #aaaaaa; /* 스크롤바 핸들 색상 (호버 시) */
    }
    
`;

export const MessageBubble = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== "isSender", // isSender를 DOM에 전달하지 않음
})`
    max-width: 70%; /* 말풍선의 최대 너비 */
    padding: 10px 15px;
    border-radius: 15px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
    position: relative;
    color: #000; /* 텍스트 색상 */

    /* 발신자와 수신자의 스타일 구분 */
    align-self: ${({ isSender }) => (isSender ? "flex-end" : "flex-start")};
    background-color: ${({ isSender }) => (isSender ? "#DCF8C6" : "#FFFFFF")};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

    /* 말풍선 꼬리 */
    &::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 0;
        height: 0;
        border: 5px solid transparent;

        ${({ isSender }) =>
                isSender
                        ? `
            right: -10px;
            border-left-color: #DCF8C6;
            transform: translateY(-50%);
          `
                        : `
            left: -10px;
            border-right-color: #FFFFFF;
            transform: translateY(-50%);
          `}
    }

    /* 발신자 정보 스타일 */
    span {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
        color: ${({ isSender }) => (isSender ? "#388e3c" : "#555555")};
    }
`;

export const ChatInputArea = styled.div`
    flex-grow: 0.5;
    display: flex;
    align-items: center;
    border-top: 1px solid #ccc;
    input {
        flex: 1;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ddd;
        margin-right: 10px;
        height: 40px;
    }

    button {
        height: 40px;
        padding: 10px 20px;
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            background-color: ${({ theme }) => theme.colors.secondary};
        }
    }
`;