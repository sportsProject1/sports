import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AiTwotoneBell } from "react-icons/ai";
import { fetchTokenData } from "../Server/ApiService";
import { shallowEqual, useSelector } from "react-redux";
import _ from "lodash"; // lodash의 throttle 사용

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

const Invite = styled.div`
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    span {
        position: relative;
        border-radius: 50%;
        background-color: red;
        display: inline-block;
        width: 20px;
        height: 20px;
        text-align: center;
        color: white;
        line-height: 20px;
        font-size: 12px;
        margin-left: 5px;
    }

    span::before {
        content: "";
        position: absolute;
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 7px 5px 0;
        border-color: transparent red transparent transparent;
    }
`;

function UserInfoBox() {
    const [topPosition, setTopPosition] = useState(170);
    const [inviteLength, setInviteLength] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const user = useSelector((state) => state.auth.user, shallowEqual);
    const navigate = useNavigate();

    const footerHeight = 250;
    const footerMargin = 100;

    // 초대 데이터 로드
    useEffect(() => {
        if (user && inviteLength === null) {
            setIsLoading(true);
            fetchTokenData(`/chat/invitations/${user.userId}`)
                .then((res) => {
                    setInviteLength(res.data.length || 0);
                })
                .catch((error) => {
                    console.error("Error fetching invitations:", error);
                    setInviteLength(0);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [user, inviteLength]);

    // 스크롤 이벤트 처리
    const handleScroll = useCallback(
        _.throttle(() => {
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;
            const documentHeight = document.body.scrollHeight;

            const footerStart = documentHeight - footerHeight;
            const visibleBottom = windowHeight + scrollY;

            if (visibleBottom > footerStart) {
                const newTopPosition = footerStart - scrollY - footerHeight - footerMargin;
                setTopPosition(newTopPosition > 20 ? newTopPosition : 20);
            } else {
                setTopPosition(170);
            }
        }, 100), // 100ms 제한
        []
    );

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

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
                    <h3>{user.nickname}님 환영합니다.</h3>

                    {isLoading ? (
                        <p>로딩 중...</p>
                    ) : (
                        <Invite onClick={()=>navigate('/chat/invite')}>
                            채팅 초대 <AiTwotoneBell />
                            <span>{inviteLength}</span>
                        </Invite>
                    )}

                    <Button onClick={() => navigate("/mypage")}>마이페이지</Button>
                    <Button onClick={handleLogout}>로그아웃</Button>
                </>
            ) : (
                <>
                    <Avatar src="https://mystudy5350.s3.amazonaws.com/test/logoblackbg.png" alt="Default Avatar" />
                    <h3>로그인하고</h3>
                    <p>함께 운동할 사람을</p>
                    <p>찾아보세요!</p>
                    <Button onClick={handleLogin}>로그인</Button>
                </>
            )}
        </UserInfoContainer>
    );
}

export default UserInfoBox;
