import {postTokenJsonData} from "../../Server/ApiService";
import {ListContainer} from "../../styled/Chat/ChatStyled";

function ChatInvite({inviteList}){

    const onAccept = async (roomId,userId) =>{
        postTokenJsonData(`/chat/accept/${roomId}`,{
            userId:userId
        }).then((res)=>{
            console.log(res)
        })
    }

    const onRemove = async (roomId,userId) =>{
        postTokenJsonData(`/chat/remove/${roomId}`,{
            userId: userId
        }).then((res)=>{
            console.log(res)
        })
    }

    if(inviteList){
        return(
            <ListContainer>
                {inviteList.map((invite,idx)=>{
                    return(
                        <div key={invite.id}>
                            <h1>{invite.roomName}</h1>
                            <div>
                            <button className={"accept"} onClick={()=>onAccept(invite.chatRoomId,invite.userId)}>수락</button>
                            <button className={"reject"} onClick={()=>onRemove(invite.chatRoomId,invite.userId)}>거절</button>
                            </div>
                        </div>
                    )
                })}
            </ListContainer>
        )
    }else{
        return(
            <div>
                초대받은 채팅방이 없습니다.
            </div>
        )
    }

}
export default ChatInvite