import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const UserInfoContainer = styled.div`
    position: fixed;
    top: ${({ $top }) => $top}px;
    right: 30px;
    background-color: ${({ theme }) => theme.colors.background};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 20px;
    width: 15%;
    height: auto;
    z-index: 99;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    transition: top 0.3s ease-in-out;

    h3 {
        font-size: 1rem;
        color: ${({ theme }) => theme.colors.primary};
    }

    p {
        font-size: 1rem;
    }
`;

const Button = styled.button`
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    width: 100%;
    text-align: center;

    &:hover {
        background-color: ${({ theme }) => theme.colors.secondary};
    }
`;

const Avatar = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.primary};
`;

function UserInfoBox() {
    const [user, setUser] = useState(null);
    const [topPosition, setTopPosition] = useState(170); // 기본 위치 설정
    const navigate = useNavigate(); // 리다이렉션을 위해 사용
    const footerHeight = 250; // 푸터의 고정 높이
    const footerMargin = 100; // 푸터와 겹칠 때 상단으로 이동하는 기준

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // 로컬스토리지에서 유저 데이터 가져오기
        }

        // 스크롤 이벤트 핸들러
        const handleScroll = () => {
            const windowHeight = window.innerHeight; // 뷰포트 높이
            const scrollY = window.scrollY; // 현재 스크롤 위치
            const documentHeight = document.body.scrollHeight; // 문서 전체 높이

            const footerStart = documentHeight - footerHeight; // 푸터 시작 위치
            const visibleBottom = windowHeight + scrollY; // 현재 화면 하단의 위치

            if (visibleBottom > footerStart) {
                // 푸터와 겹칠 경우: 푸터 시작점에서 footerMargin만큼 위로 이동
                const newTopPosition = footerStart - scrollY - footerHeight - footerMargin;

                // 최소 상단 위치를 20px로 제한
                setTopPosition(newTopPosition > 20 ? newTopPosition : 20);
            } else {
                // 기본 위치로 복원
                setTopPosition(170);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [footerHeight, footerMargin]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <UserInfoContainer $top={topPosition}>
            {user ? (
                <>
                    <Avatar src={user.imgURL} alt="User Avatar" />
                    <h3>{user.nickname}</h3>
                    <p>{user.email}</p>

                    <div>뭐여기이제</div>
                    <div>채팅방목록이라든가</div>
                    <div>이제</div>
                    <div>그런거추가</div>

                    <Button onClick={handleLogout}>로그아웃</Button>
                </>
            ) : (
                <>
                    <Avatar src="https://via.placeholder.com/80" alt="Default Avatar" />
                    <h3>로그인 좀 해주세요</h3>
                    <p>로그인 하시면 좋겠네요</p>
                    <Button onClick={handleLogin}>로그인</Button>
                </>
            )}
        </UserInfoContainer>
    );
}

export default UserInfoBox;