import styled from 'styled-components';
import {useEffect, useState} from "react";
import {fetchTokenData} from "../../Server/ApiService";
import {useNavigate} from "react-router-dom";

const LayoutContainer = styled.div`
  display: flex;
    width: 80%;
    margin: auto;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 15%; /* 사이드바 너비 */
  background-color: #4b2b2b; /* 진한 갈색 */
    color:#ccc
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #d8e9d1; /* 밝은 녹색 */
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 10%; /* 헤더 높이 */
  background-color: #cc6f6f; /* 분홍색 */
`;

const ContentSection = styled.div`
  flex: 1;
  border-top: 2px solid #cc6f6f; /* 분홍색 구분선 */
`;

const Footer = styled.div`
  height: 10%; /* 푸터 높이 */
  background-color: #cc6f6f; /* 분홍색 */
`;

function Chat(){
    const [chatRoomList,setChatRoomList] = useState();

    const navigate = useNavigate()
    useEffect(() => {
        fetchTokenData('/chat/my-rooms').then((res)=>{
            setChatRoomList(res.data);
        })
    }, []);
    console.log(chatRoomList)
    return(
        <LayoutContainer>
            <Sidebar>
                <p>채팅 목록</p>
                <p>초대 내역</p>
            </Sidebar>
            <MainContent>
                <Header />
                {chatRoomList?.map((list)=>{
                    return(
                        <div key={list.id} onClick={()=>navigate(`/chat/${list.id}`)}>
                            <h1>{list.roomName}</h1>
                        </div>
                    )
                })}
                <ContentSection />
                <ContentSection />
                <ContentSection />
                <ContentSection />
                <Footer />
            </MainContent>
        </LayoutContainer>
    )
}
export default Chat