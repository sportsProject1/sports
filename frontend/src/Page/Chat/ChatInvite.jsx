import {useEffect, useState} from "react";
import {fetchTokenData} from "../../Server/ApiService";
import {useSelector} from "react-redux";

function ChatInvite(){
    const [inviteList,setInviteList] = useState()
    const user = useSelector((state) => state.auth.user);
    const userId = user ? user.userId : null; // user가 존재하는 경우에만 userId를 가져옴

    useEffect(() => {
        if (userId) { // userId가 존재할 때만 fetch 실행
            fetchTokenData(`/chat/invitations/${userId}`).then((res) => {
                console.log(res);
            });
        }
    }, [userId]);
    return(
        <div>



        </div>
    )
}
export default ChatInvite