import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const UserInfoContainer = styled.div`
    position: fixed;
//     top: 120px;
    top: 170px;
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
    const navigate = useNavigate(); // 리다이렉션을 위해 사용

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // 로컬스토리지에서 유저 데이터 가져오기
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <UserInfoContainer>
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
