import React, { useCallback, useEffect, useState } from "react";
import { postTokenJsonData } from "../../Server/ApiService";
import { postJsonData } from "../../Server/ApiServiceNoToken";
import { ChatRoomItem, InviteButtonBox, ListContainer } from "../../styled/Chat/ChatStyled";

function ChatInvite({ inviteList, setInviteList, fetchChatRooms }) {
    // 썸네일
    const [thumbnails, setThumbnails] = useState({});

    // 썸네일 데이터 가져오기
    useEffect(() => {
        const boardIds = inviteList.map((invite) => invite.boardId); // boardId 추출
        console.log("Invite List1111:", inviteList);
        console.log("Board IDs being sent:", boardIds);

        const fetchThumbnails = async () => {
            try {
                const response = await postJsonData("/board/thumbnails", boardIds); // 썸네일 API 호출
                console.log("Thumbnail Response:", response);
                const thumbnailsMap = response.reduce((acc, { boardId, thumbnailUrl }) => {
                    acc[boardId] = thumbnailUrl;
                    return acc;
                }, {});
                setThumbnails(thumbnailsMap); // 썸네일 상태 업데이트
            } catch (error) {
                console.error("Failed to fetch thumbnails:", error);
            }
        };

        if (inviteList.length > 0) {
            fetchThumbnails();
        }
    }, [inviteList]);

    // 초대 수락
    const onAccept = useCallback(
        async (roomId, userId) => {
            try {
                await postTokenJsonData(`/chat/accept/${roomId}`, { userId });
                // 초대 목록에서 해당 항목 제거
                setInviteList((prev) => prev.filter((invite) => invite.chatRoomId !== roomId));
                // 채팅방 목록 즉시 업데이트
                fetchChatRooms();
            } catch (error) {
            }
        },
        [setInviteList, fetchChatRooms]
    );

    // 초대 거절
    const onRemove = useCallback(
        async (roomId, userId) => {
            try {
                await postTokenJsonData(`/chat/remove/${roomId}`, { userId });
                // 초대 목록에서 해당 항목 제거
                setInviteList((prev) => prev.filter((invite) => invite.chatRoomId !== roomId));
            } catch (error) {
            }
        },
        [setInviteList]
    );

    // 초대 내역이 있는 경우와 없는 경우 렌더링
    return inviteList?.length > 0 ? (
        <ListContainer>
            {inviteList.map((invite) => {
                const thumbnailUrl = thumbnails[invite.boardId]; // 썸네일 URL 설정
                return (
                <ChatRoomItem key={invite.chatRoomId}>
                    <div>
                        <img src={thumbnailUrl} alt="Chat Room" />
                        <span>{invite.roomName}</span>
                    </div>
                    <InviteButtonBox>
                        <button onClick={() => onAccept(invite.chatRoomId, invite.userId)}>수락</button>
                        <button onClick={() => onRemove(invite.chatRoomId, invite.userId)}>거절</button>
                    </InviteButtonBox>
                </ChatRoomItem>
            );
        })}
        </ListContainer>
    ) : (
        <div>초대받은 채팅방이 없습니다.</div>
    );
}

export default ChatInvite;
