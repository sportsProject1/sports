import { ChatItem } from "../../styled/Chat/ChatStyled";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../Components/LoadingPage";

function ChatList({ chatRoomList, onChatRoomClick }) {
    const navigate = useNavigate();

    if (chatRoomList) {
        return (
            <div>
                {chatRoomList.map((list) => {
                    return (
                        <ChatItem
                            key={list.id}
                            onClick={() => {
                                onChatRoomClick(list.id); // 부모로 채팅방 ID 전달
                                navigate(`/chat/chatroom`); // 경로 변경
                            }}
                        >
                            <h1>{list.roomName}</h1>
                        </ChatItem>
                    );
                })}
            </div>
        );
    } else {
        return <LoadingPage />;
    }
}

export default ChatList;
