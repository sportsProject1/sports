import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function ChatRoom({ chatRoomId, userId }) {
    const [messages, setMessages] = useState([]); // 메시지 상태
    const [newMessage, setNewMessage] = useState(""); // 새 메시지 입력 상태
    const [client, setClient] = useState(null); // STOMP 클라이언트
    const [page, setPage] = useState(0); // 페이지 번호
    const [hasMore, setHasMore] = useState(true); // 더 불러올 메시지가 있는지 여부
    const [loading, setLoading] = useState(false); // 로딩 상태

    useEffect(() => {
        if (!chatRoomId) {
            console.error("유효하지 않은 chatRoomId:", chatRoomId);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("액세스 토큰이 없습니다.");
            return;
        }

        // STOMP 클라이언트 생성
        const stompClient = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8090/chat/ws"), // SockJS WebSocket 연결
            connectHeaders: { Authorization: `Bearer ${token}` },
            debug: (str) => console.log("STOMP Debug:", str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket 연결 성공");

                // WebSocket 구독
                stompClient.subscribe(`/topic/chat/chatRoom/${chatRoomId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    console.log("실시간 메시지 수신:", receivedMessage);

                    // 실시간으로 메시지를 추가
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            },
            onStompError: (error) => {
                console.error("STOMP 연결 오류:", error);
            },
        });

        stompClient.activate(); // WebSocket 활성화
        setClient(stompClient);

        return () => {
            if (stompClient) stompClient.deactivate(); // WebSocket 연결 해제
        };
    }, [chatRoomId]);

    // 기존 메시지 불러오기
    const loadInitialMessages = async () => {
        if (loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 메시지가 없으면 중단
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:8090/${chatRoomId}/messages?page=${page}&size=20`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();

            if (!Array.isArray(data)) {
                console.error("API로부터 받은 데이터가 배열이 아닙니다:", data);
                return;
            }

            if (data.length < 20) {
                setHasMore(false); // 더 이상 불러올 메시지가 없음을 표시
            }

            // 메시지 상태 업데이트 (과거 메시지를 맨 앞에 추가)
            setMessages((prevMessages) => [...data.reverse(), ...prevMessages]);
            setPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error("기존 메시지 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 초기 메시지 로드
    useEffect(() => {
        loadInitialMessages();
    }, []);

    // 스크롤 이벤트 핸들러
    const handleScroll = (event) => {
        const { scrollTop } = event.target;
        if (scrollTop === 0 && hasMore && !loading) {
            loadInitialMessages(); // 스크롤이 상단에 도달하면 추가 메시지 로드
        }
    };

    const sendMessage = () => {
        if (client && newMessage.trim() !== "") {
            const message = {
                chatRoomId,
                senderId: userId,
                content: newMessage,
            };

            client.publish({
                destination: "/app/chatRoom/sendMessage", // 메시지 전송 경로
                body: JSON.stringify(message),
            });

            setNewMessage(""); // 입력창 초기화
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
                onScroll={handleScroll}
            >
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId === userId ? "You" : `User ${msg.senderId}`}:</strong> {msg.content}
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
}

export default ChatRoom;
