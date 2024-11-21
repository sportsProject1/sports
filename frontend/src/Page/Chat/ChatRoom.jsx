import React, { useState, useEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function ChatRoom({chatRoomId,userId}){
    const [messages, setMessages] = useState([]); // 채팅 메시지 목록
    const [newMessage, setNewMessage] = useState(""); // 새 메시지 입력
    const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트

    console.log("123123")



    useEffect(() => {
        // WebSocket 연결 설정
        const socket = new SockJS("http://localhost:8090/chat/ws");
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log("Connected to WebSocket");

            // 특정 채팅방 구독
            client.subscribe(`/topic/chatroom/${chatRoomId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            });

            setStompClient(client);
        });

        return () => {
            // 컴포넌트가 언마운트되면 WebSocket 연결 해제
            if (client) client.disconnect();
        };
    }, [chatRoomId]);

    const sendMessage = () => {
        if (stompClient && newMessage.trim() !== "") {
            const message = {
                chatRoomId: chatRoomId,
                senderId: userId,
                content: newMessage,
            };
            stompClient.send("/app/chat/chatRoom/sendMessage", {}, JSON.stringify(message));
            setNewMessage(""); // 메시지 전송 후 입력창 초기화
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd" }}>
            <h2>Chat Room {chatRoomId}</h2>
            <div
                style={{
                    height: "300px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                }}
            >
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId === userId ? "You" : `User ${msg.senderId}`}:</strong>{" "}
                        {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                style={{ width: "calc(100% - 100px)", marginRight: "10px" }}
            />
            <button onClick={sendMessage} style={{ width: "90px" }}>
                Send
            </button>
        </div>
    );
};

export default ChatRoom;
