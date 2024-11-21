import { useState, useEffect } from "react";
import { fetchTokenData } from "../../Server/ApiService";
import { Link, useLocation } from "react-router-dom";
import ChatInvite from "./ChatInvite";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import { ChatContainer, ChatSidebar, ChatSection } from "../../styled/Chat/ChatStyled";
import { useSelector } from "react-redux";

function Chat() {
    const [chatRoomList, setChatRoomList] = useState([]);
    const [inviteList, setInviteList] = useState([]);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null); // 클릭된 채팅방 ID 관리

    // 현재 로그인한 유저의 ID 가져오기
    const user = useSelector((state) => state.auth?.user);
    const userId = user ? user.userId : null;

    const location = useLocation();

    useEffect(() => {
        // 채팅방 목록 가져오기
        fetchTokenData('/chat/my-rooms').then((res) => {
            setChatRoomList(res.data);
        });

        // 초대 내역 가져오기
        if (userId) {
            fetchTokenData(`/chat/invitations/${userId}`).then((res) => {
                setInviteList(res.data);
            });
        }
    }, [userId]);

    // 경로에 따라 렌더링할 컴포넌트 결정
    const renderContent = () => {
        if (location.pathname === "/chat/invite") {
            return <ChatInvite inviteList={inviteList} />;
        } else if (location.pathname === "/chat/chatroom") {
            return <ChatRoom chatRoomId={selectedChatRoomId} userId={userId} />; // 선택된 채팅방 ID 전달
        } else {
            return <ChatList chatRoomList={chatRoomList} onChatRoomClick={setSelectedChatRoomId} />; // 클릭 이벤트 전달
        }
    };

    return (
        <ChatContainer>
            <ChatSidebar>
                <Link to="/chat">채팅방 목록</Link>
                <Link to="/chat/invite">초대 내역</Link>
            </ChatSidebar>
            <ChatSection>
                {renderContent()}
            </ChatSection>
        </ChatContainer>
    );
}

export default Chat;
