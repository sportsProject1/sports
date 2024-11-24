import React, { useCallback } from "react";
import { postTokenJsonData } from "../../Server/ApiService";
import { ChatRoomItem, InviteButtonBox, ListContainer } from "../../styled/Chat/ChatStyled";

function ChatInvite({ inviteList, setInviteList, fetchChatRooms }) {
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
            {inviteList.map((invite) => (
                <ChatRoomItem key={invite.chatRoomId}>
                    <div>
                        <img src={"https://via.placeholder.com/300"} alt="Chat Room" />
                        <span>{invite.roomName}</span>
                    </div>
                    <InviteButtonBox>
                        <button onClick={() => onAccept(invite.chatRoomId, invite.userId)}>수락</button>
                        <button onClick={() => onRemove(invite.chatRoomId, invite.userId)}>거절</button>
                    </InviteButtonBox>
                </ChatRoomItem>
            ))}
        </ListContainer>
    ) : (
        <div>초대받은 채팅방이 없습니다.</div>
    );
}

export default ChatInvite;
