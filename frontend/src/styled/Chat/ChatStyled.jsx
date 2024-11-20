import styled from "styled-components";

export const ChatContainer = styled.div`
  display: flex;
    width: 50%;
    margin: 50px auto 0 auto;
  height: 70vh;
`;

export const ChatSidebar = styled.div`
  width: 15%; /* 사이드바 너비 */
  background-color: #4b2b2b; /* 진한 갈색 */
    color:#ccc
`;

export const ChatSection = styled.div`
  flex: 1;
  background-color: #d8e9d1; /* 밝은 녹색 */
  display: flex;
  flex-direction: column;
`;

export const ChatHeader = styled.div`
  height: 10%; /* 헤더 높이 */
  background-color: #cc6f6f; /* 분홍색 */
`;

export const ChatItem = styled.div`
  flex: 1;
  border-top: 2px solid #cc6f6f; /* 분홍색 구분선 */
`;