import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchTokenData } from "../../Server/ApiService";
import { useLocation, useNavigate } from "react-router-dom";
import ChatInvite from "./ChatInvite";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import { ChatAppContainer, MainContainer, Sidebar, SidebarItem } from "../../styled/Chat/ChatStyled";
import { useSelector } from "react-redux";

function Chat() {
    const [chatRoomList, setChatRoomList] = useState([]);
    const [inviteList, setInviteList] = useState([]);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);

    const user = useSelector((state) => state.auth?.user);
    const userId = user?.userId || null;
    const navigate = useNavigate();
    const location = useLocation();

    // 채팅방 목록 가져오기
    const fetchChatRooms = useCallback(async () => {
        try {
            const rooms = await fetchTokenData('/chat/my-rooms').then((res) => res.data);

            const roomsWithLastMessage = await Promise.all(
                rooms.map(async (room) => {
                    const lastMessageTimestamp = await fetchTokenData(
                        `${room.id}/lastMessageTimestamp`
                    )
                        .then((res) => res.data)
                        .catch(() => null);
                    return {
                        ...room,
                        lastMessageTimestamp,
                    };
                })
            );

            const sortedRooms = roomsWithLastMessage.sort((a, b) => {
                if (!a.lastMessageTimestamp && !b.lastMessageTimestamp) return 0;
                if (!a.lastMessageTimestamp) return 1;
                if (!b.lastMessageTimestamp) return -1;
                return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
            });

            setChatRoomList(sortedRooms);
        } catch (error) {
        }
    }, []);

    // 초대 내역 가져오기
    const fetchInviteList = useCallback(async () => {
        if (!userId) return;
        try {
            const invites = await fetchTokenData(`/chat/invitations/${userId}`).then((res) => res.data);
            setInviteList(invites);
        } catch (error) {
        }
    }, [userId]);

    // 데이터 로드
    useEffect(() => {
        if (location.pathname === "/chat") {
            fetchChatRooms();
        } else if (location.pathname === "/chat/invite") {
            fetchInviteList();
        }
    }, [location.pathname, fetchChatRooms, fetchInviteList]);

    // 경로에 따라 렌더링할 컴포넌트 결정
    const renderContent = useMemo(() => {
        if (location.pathname === "/chat/invite") {
            return (
                <ChatInvite
                    inviteList={inviteList}
                    setInviteList={setInviteList}
                    fetchChatRooms={fetchChatRooms}
                />
            );
        } else if (location.pathname === "/chat/chatroom") {
            return <ChatRoom chatRoomId={selectedChatRoomId} userId={userId} />;
        } else {
            return <ChatList chatRoomList={chatRoomList} onChatRoomClick={setSelectedChatRoomId} />;
        }
    }, [location.pathname, inviteList, chatRoomList, selectedChatRoomId, userId, fetchChatRooms]);

    return (
        <ChatAppContainer>
            <Sidebar>
                <SidebarItem onClick={() => navigate('/chat')}>채팅방 목록</SidebarItem>
                <SidebarItem onClick={() => navigate('/chat/invite')}>초대 내역</SidebarItem>
            </Sidebar>
            <MainContainer>{renderContent}</MainContainer>
        </ChatAppContainer>
    );
}

export default Chat;
