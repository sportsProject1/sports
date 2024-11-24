import React, { useCallback } from "react";
import { ChatRoomItem, ChatRoomItemInfo, ListContainer } from "../../styled/Chat/ChatStyled";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../Components/LoadingPage";
import { getTimeElapsed } from "../../Utils/getTimeElapsed";
import { AiOutlineRight } from "react-icons/ai";

function ChatList({ chatRoomList, onChatRoomClick }) {
    const navigate = useNavigate();

    // 채팅방 클릭 핸들러를 useCallback으로 메모이제이션
    const handleRoomClick = useCallback(
        (roomId) => {
            onChatRoomClick(roomId); // 부모로 채팅방 ID 전달
            navigate(`/chat/chatroom`); // 경로 변경
        },
        [navigate, onChatRoomClick]
    );

    // 게시글 보기 클릭 핸들러
    const handleBoardClick = useCallback(
        (boardId) => {
            navigate(`/board/detail/${boardId}`);
        },
        [navigate]
    );

    // 채팅방 리스트 렌더링
    const renderChatRoomItem = useCallback(
        (list) => (
            <ChatRoomItem key={list.id}>
                <div onClick={() => handleRoomClick(list.id)}>
                    <img src={"https://via.placeholder.com/300"} alt="Chat Room" />
                    <span>{list.roomName}</span>
                </div>
                <ChatRoomItemInfo>
                    <p>{getTimeElapsed(list.lastMessageTimestamp)}</p>
                    <p onClick={() => handleBoardClick(list.boardId)}>
                        해당 게시글 보기 <AiOutlineRight />
                    </p>
                </ChatRoomItemInfo>
            </ChatRoomItem>
        ),
        [handleRoomClick, handleBoardClick]
    );

    // 초대받은 채팅방이 없을 경우 로딩 페이지 표시
    if (!chatRoomList) {
        return <LoadingPage />;
    }

    return <ListContainer>{chatRoomList.map(renderChatRoomItem)}</ListContainer>;
}

export default React.memo(ChatList);
