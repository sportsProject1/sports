import styled from 'styled-components';

// 전체 컨테이너
export const ChatAppContainer = styled.div`
    display: flex;
    width: 50%;
    height: 600px;
    margin: auto;
    background-color: #f0f0f0;
`;

// 좌측 사이드바
export const Sidebar = styled.div`
    width: 20%;
    background-color: #8b0000;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding: 20px;
`;

// 좌측 메뉴 항목
export const SidebarItem = styled.div`
    padding: 10px 15px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 5px;
    background-color: ${(props) => (props.active ? '#5a0000' : 'transparent')};
    transition: background-color 0.3s;

    &:hover {
        background-color: #5a0000;
    }
`;

// 초대/채팅방 리스트
export const ListContainer = styled.div`
    flex: 1;
    width: 100%;
    background-color: #ffdddd;
    padding: 10px;
    border-radius: 5px;
    overflow-y: auto;

    .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #ccffcc;
        padding: 10px;
        margin-bottom: 5px;
        border-radius: 5px;

        .action-buttons {
            display: flex;
            gap: 5px;

            button {
                padding: 5px 10px;
                border: none;
                border-radius: 5px;
                cursor: pointer;

                &.accept {
                    background-color: #4caf50;
                    color: white;
                }

                &.reject {
                    background-color: #f44336;
                    color: white;
                }
            }
        }
    }
`;

export const ChatRoomItem = styled.div`
    width: 100%;
    height: 100px;
    background-color: antiquewhite;
    margin-bottom: 15px;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    div{
        display: flex;
        align-items: center;
    }
    img{
        height: 100%;
        border-radius: 15px;
        margin-right: 15px;
    }
`

// 우측 메인 컨테이너
export const MainContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: ${(props) => (props.chatOpen ? '#004400' : '#ffeeee')};
`;

// 채팅방 상단 헤더
export const ChatHeader = styled.div`
    background-color: #ccffcc;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
        margin: 0;
    }
`;

// 채팅 내역
export const ChatHistory = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    .message {
        display: flex;
        margin-bottom: 10px;

        &.me {
            justify-content: flex-end;
        }

        .profile {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: gray;
            margin-right: 10px;
        }

        .text {
            max-width: 60%;
            padding: 10px;
            border-radius: 10px;
            background-color: ${(props) => (props.isMe ? '#aaffaa' : 'white')};
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
    }
`;

// 채팅 입력창
export const ChatInputArea = styled.div`
    display: flex;
    padding: 10px;
    background-color: #ccffcc;

    input {
        flex: 1;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ddd;
        margin-right: 10px;
    }

    button {
        padding: 10px 20px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            background-color: #388e3c;
        }
    }
`;
