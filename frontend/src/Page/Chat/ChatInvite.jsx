function ChatInvite({inviteList}){

    if(inviteList){
        return(
            <div>
                {inviteList.map((invite,idx)=>{
                    return(
                        <div key={invite.id}>
                            <h1>{invite.roomName}</h1>
                        </div>
                    )
                })}
            </div>
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