import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Store/authSlice";
import styled from "styled-components";
import { postTokenJsonData } from "../../Server/ApiService";
import {FaPersonChalkboard, FaUserGear} from "react-icons/fa6";
import Logo from "./Logo";
import {FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUserPlus} from "react-icons/fa";

const MenuContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
    position: relative; /* 가운데 요소 절대 배치를 위한 부모 위치 설정 */

    ul {
        display: flex;
        gap: 15px; /* 요소 간격 */
    }

    /* Logo를 가운데 배치 */
    > div:first-child {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
`;

const MenuList = styled.ul`
    display: flex;
    gap: 15px;
    li {
        list-style: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding-bottom: 3px;
        a,
        svg {
            text-decoration: none;
            font-size: 1rem;
            color: inherit;
        }

        &:hover {
            color: ${({ theme }) => theme.colors.primary};
            border-bottom: 2px solid #ccc;
        }
    }
`;

const AdminNav = styled(Link)`
    text-shadow: 5px 5px 4px rgba(49, 46, 255, 0.5);
`;

const StyledIcon = styled(FaPersonChalkboard)`
    filter: drop-shadow(5px 5px 4px rgba(49, 46, 255, 0.5));
`;

function Menu() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            await postTokenJsonData("/logout", null);
            localStorage.clear();
            dispatch(logout());
            navigate("/");
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    // 장바구니 클릭 핸들러
    const handleCartClick = () => {
        user ? navigate("/shop/cart") : navigate("/login");
    };

    // 공통 메뉴
    const CommonMenu = () => (
        <>
            <li>
                <Link to="/board">운동이야기</Link>
            </li>
            <li>
                <Link to="/board/recruit">같이해요</Link>
            </li>
            {user ? <li>
                <Link to="/chat">채팅</Link>
            </li> : null}

            <li>
                <Link to="/shop">쇼핑</Link>
            </li>
        </>
    );

    // 사용자 메뉴
    const UserMenu = () =>
        !user ? (
            <>
                <li>
                    <Link to="/register">
                        회원가입 <FaUserPlus />
                    </Link>
                </li>
                <li>
                    <Link to="/login">
                        로그인 <FaSignInAlt />
                    </Link>
                </li>
            </>
        ) : (
            <>
                <li onClick={handleLogout}>
                    로그아웃 <FaSignOutAlt/>
                </li>
                <li>
                    <Link to="/mypage">
                        마이페이지 <FaUserGear/>
                    </Link>
                </li>
                <li onClick={handleCartClick}>
                    장바구니 <FaShoppingCart/>
                </li>
            </>
        );

    // 관리자 메뉴
    const AdminMenu = () =>
        user?.role === "ROLE_ADMIN" && (
            <li>
                <AdminNav to="/admin">
                    관리자 <StyledIcon />
                </AdminNav>
            </li>
        );

    return (
        <MenuContainer>
            {/* 로고 */}
            <Logo />

            {/* 왼쪽 메뉴 */}
            <MenuList>
                <CommonMenu />
                <AdminMenu />
            </MenuList>

            {/* 오른쪽 메뉴 */}
            <MenuList>
                <UserMenu />

            </MenuList>
        </MenuContainer>
    );
}

export default Menu;
