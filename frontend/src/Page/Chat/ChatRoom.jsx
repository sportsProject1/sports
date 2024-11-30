import React, { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
    ChatHeader,
    ChatHistory,
    ChatInputArea,
    ChatRoomContainer,
    MessageBubble,
} from "../../styled/Chat/ChatStyled";
import { AiOutlineSend } from "react-icons/ai";

function ChatRoom({ chatRoomId, userId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [client, setClient] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const chatHistoryRef = useRef(null);
    const isInitialLoad = useRef(true); // 첫 로드 여부 플래그

    // 스크롤을 최하단으로 이동시키는 함수
    const scrollToBottom = useCallback(() => {
        const chatHistory = chatHistoryRef.current;
        if (chatHistory) {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }, []);

    // WebSocket 클라이언트 설정
    useEffect(() => {
        console.log("useEffect 실행됨");
        if (!chatRoomId) {
            console.error("chatRoomId가 유효하지 않음");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("토큰이 유효하지 않음");
            return;
        }

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`https://sports-5ebw.onrender.com/chat/wss?token=${token}`),
            debug: (str) => console.log("STOMP 디버그 메시지:", str),
            reconnectDelay: 20000,
            onConnect: () => {
                console.log("STOMP 연결 성공");

                // 채팅방 구독 추가
                stompClient.subscribe(`/topic/chat/chatRoom/${chatRoomId}`, (message) => {
                    console.log("새 메시지 수신:", message.body);
                    const receivedMessage = JSON.parse(message.body);

                    // 수신한 메시지를 상태에 추가
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            },
            onStompError: (error) => {
                console.error("STOMP 연결 오류:", error);
            },
        });

        try {
            stompClient.activate();
            console.log("STOMP 클라이언트 활성화 완료");
        } catch (error) {
            console.error("STOMP 활성화 중 오류 발생:", error);
        }

        setClient(stompClient);

        return () => {
            console.log("STOMP 클라이언트 비활성화");
            stompClient.deactivate();
        };
    }, [chatRoomId]);

    // 초기 메시지 로드 및 스크롤 이동
    const loadInitialMessages = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `https://sports-5ebw.onrender.com/${chatRoomId}/messages?page=${page}&size=20`, // HTTP 프로토콜로 요청
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();

            if (!Array.isArray(data)) {
                console.error("API로부터 받은 데이터가 배열이 아닙니다:", data);
                return;
            }

            if (data.length < 20) {
                setHasMore(false);
            }

            setMessages((prevMessages) => [...data.reverse(), ...prevMessages]);
            setPage((prevPage) => prevPage + 1);

            // 첫 로드 시 스크롤 최하단
            if (isInitialLoad.current) {
                isInitialLoad.current = false; // 플래그 변경
                setTimeout(scrollToBottom, 0);
            }
        } catch (error) {
            console.error("메시지를 불러오는 중 오류 발생:", error);
        } finally {
            setLoading(false);
        }
    }, [chatRoomId, page, hasMore, loading, scrollToBottom]);

    // 메시지가 추가될 때 스크롤 최하단
    useEffect(() => {
        if (!isInitialLoad.current) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);

    // 스크롤 이벤트 처리
    const handleScroll = useCallback(
        (event) => {
            const { scrollTop } = event.target;
            if (scrollTop === 0 && hasMore && !loading) {
                loadInitialMessages();
            }
        },
        [hasMore, loading, loadInitialMessages]
    );

    // 메시지 전송
    const sendMessage = useCallback(() => {
        // 클라이언트가 연결되어 있고 메시지가 비어 있지 않은 경우에만 전송
        if (client) {
            if (!client.connected) {
                console.error("STOMP 연결이 끊어졌습니다. 재연결을 시도합니다.");
                client.activate();  // 클라이언트 재연결 시도
                return;
            }

            if (newMessage.trim() !== "") {
                const message = {
                    chatRoomId,
                    senderId: userId,
                    content: newMessage,
                };

                // 메시지 전송
                client.publish({
                    destination: "/app/chatRoom/sendMessage",
                    body: JSON.stringify(message),
                });

                setNewMessage(""); // 메시지 전송 후 입력 필드 초기화
            }
        } else {
            console.error("클라이언트가 없습니다.");
        }
    }, [client, newMessage, chatRoomId, userId]);

    // 초기 메시지 로드
    useEffect(() => {
        loadInitialMessages();
    }, [loadInitialMessages]);

    return (
        <ChatRoomContainer>
            <ChatHeader>
                <h1> Chat Room {chatRoomId}</h1>
            </ChatHeader>
            <ChatHistory ref={chatHistoryRef} onScroll={handleScroll}>
                {messages.map((msg, index) => (
                    <MessageBubble key={index} isSender={msg.senderId === userId}>
                        <span>{msg.senderId === userId ? "나" : `${msg.senderName}`}:</span>
                        {msg.content}
                    </MessageBubble>
                ))}
            </ChatHistory>
            <ChatInputArea>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    style={{ width: "calc(100% - 100px)", marginRight: "10px" }}
                />
                <button onClick={sendMessage}>
                    <AiOutlineSend />
                </button>
            </ChatInputArea>
        </ChatRoomContainer>
    );
}

export default ChatRoom;
