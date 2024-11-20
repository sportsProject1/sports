import styled from 'styled-components';
import {useEffect, useState} from "react";
import {fetchTokenData} from "../../Server/ApiService";
import {Link, useNavigate, useParams} from "react-router-dom";
import ChatInvite from "./ChatInvite";
import ChatList from "./ChatList";
import {ChatContainer, ChatHeader, ChatItem, ChatSection, ChatSidebar} from "../../styled/Chat/ChatStyled";
import {useSelector} from "react-redux";


function Chat(){
    const [chatRoomList,setChatRoomList] = useState();
    const [inviteList,setInviteList] = useState();

    // 현재 로그인한 유저의 ID 가져오기
    const user = useSelector((state) => state.auth?.user);
    const userId = user ? user.userId : null; // user가 존재하는 경우에만 userId 가져옴

    console.log(userId);
    const { invite } = useParams();

    const navigate = useNavigate();
    useEffect(() => {
        fetchTokenData('/chat/my-rooms').then((res) => {
            setChatRoomList(res.data);
        });

        if (userId) {
            fetchTokenData(`/chat/invitations/${userId}`).then((res) => {
                // 초대 내역 로직
                setInviteList(res.data)
            });
        }
    }, [userId]);
    console.log(inviteList)
    return(
        <ChatContainer>
            <ChatSidebar>
                <Link to={'/chat'}>채팅방 목록</Link>
                <Link to={'/chat/invite'}>초대 내역</Link>
            </ChatSidebar>
            <ChatSection>
                <ChatHeader />
                {invite ? <ChatInvite inviteList={inviteList}/> : <ChatList chatRoomList={chatRoomList}/>}

            </ChatSection>
        </ChatContainer>
    )
}
export default Chat