import {ChatRoomItem, ListContainer} from "../../styled/Chat/ChatStyled";
import {useNavigate} from "react-router-dom";
import LoadingPage from "../../Components/LoadingPage";
import {getTimeElapsed} from "../../Utils/getTimeElapsed";

function ChatList({ chatRoomList, onChatRoomClick }) {
    const navigate = useNavigate();

    console.log(chatRoomList)

    if (chatRoomList) {
        return (
            <ListContainer>
                {chatRoomList.map((list) => {
                    return (
                        <ChatRoomItem
                            key={list.id}
                            onClick={() => {
                                onChatRoomClick(list.id); // 부모로 채팅방 ID 전달
                                navigate(`/chat/chatroom`); // 경로 변경
                            }}
                        >
                            <div>
                                <img src={"https://via.placeholder.com/300"}/>
                                <span>{list.roomName}</span>
                            </div>

                            <span>{getTimeElapsed(list.lastMessageTimestamp)}</span>
                        </ChatRoomItem>
                    );
                })}
            </ListContainer>
        );
    } else {
        return <LoadingPage />;
    }
}

export default ChatList;
