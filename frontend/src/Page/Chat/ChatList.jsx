import React, { useCallback, useEffect, useState } from "react";
import { ChatRoomItem, ChatRoomItemInfo, ListContainer } from "../../styled/Chat/ChatStyled";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../Components/LoadingPage";
import { getTimeElapsed } from "../../Utils/getTimeElapsed";
import { AiOutlineRight } from "react-icons/ai";
import { postJsonData } from "../../Server/ApiServiceNoToken";

function ChatList({ chatRoomList, onChatRoomClick }) {
    const navigate = useNavigate();
    const [thumbnails, setThumbnails] = useState({});

    // 썸네일 데이터 가져오기
    useEffect(() => {
        // chatRoomList에서 boardId만 추출
        const boardIds = chatRoomList.map((room) => room.boardId);

        // 썸네일 요청 함수
        const fetchThumbnails = async () => {
            try {
                const response = await postJsonData("/board/thumbnails", boardIds); // 썸네일 API 호출
                const thumbnailsMap = response.reduce((acc, { boardId, thumbnailUrl }) => {
                    acc[boardId] = thumbnailUrl;
                    return acc;
                }, {});
                setThumbnails(thumbnailsMap); // 썸네일 상태 업데이트
            } catch (error) {
                console.error("Failed to fetch thumbnails:", error);
            }
        };

        if (chatRoomList.length > 0) {
            fetchThumbnails();
        }
    }, [chatRoomList]); // chatRoomList가 변경될 때마다 실행

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
        (list) => {
            const thumbnailUrl = thumbnails[list.boardId]
            return (
            <ChatRoomItem key={list.id}>
                <div onClick={() => handleRoomClick(list.id)}>
                    <img src={thumbnailUrl} alt="Chat Room" />
                    <span>{list.roomName}</span>
                </div>
                <ChatRoomItemInfo>
                    <p>{getTimeElapsed(list.lastMessageTimestamp)}</p>
                    <p onClick={() => handleBoardClick(list.boardId)}>
                        해당 게시글 보기 <AiOutlineRight />
                    </p>
                </ChatRoomItemInfo>
            </ChatRoomItem>
            );
        },
        [handleRoomClick, handleBoardClick, thumbnails ]
    );

    // 초대받은 채팅방이 없을 경우 로딩 페이지 표시
    if (!chatRoomList) {
        return <LoadingPage />;
    }

    return <ListContainer>{chatRoomList.map(renderChatRoomItem)}</ListContainer>;
}

export default React.memo(ChatList);
