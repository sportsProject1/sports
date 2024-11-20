import {ChatItem} from "../../styled/Chat/ChatStyled";
import {useNavigate} from "react-router-dom";
import LoadingPage from "../../Components/LoadingPage";

function ChatList({chatRoomList}){
    const navigate = useNavigate()
    if(chatRoomList){
        return(
            <div>
                {chatRoomList?.map((list)=>{
                    return(
                        <ChatItem key={list.id} onClick={()=>navigate(`/chat/${list.id}`)}>
                            <h1>{list.roomName}</h1>
                        </ChatItem>
                    )
                })}
            </div>
        )
    }else{
        return (
            <LoadingPage/>
        )
    }

}
export default ChatList