import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {postData} from "../Server/ApiServiceNoToken";
import axios from "axios";
import {useState} from "react";
import {logout} from "../Store/authSlice";

const NavContainer = styled.nav`
    width:100%;
    height: 100px;
    display: flex;
    border-bottom: 1px solid #ccc;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    > ul{
        display: flex;
        align-items: center;
    }
    > ul li{
        list-style: none;
        margin:15px;
        padding:15px;
        cursor: pointer;
    }
    > ul li:hover{
        border-bottom: 1px solid #ccc;
        box-shadow: 0 2px  0 rgba(0,0,0,.2);
    }
`

function Navbar(){

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 로그아웃 요청 보내기
            await postData("logout");

            // 로컬스토리지 초기화
            localStorage.clear();

            // Redux 스토어에서 사용자 정보 제거 (로그아웃 후 상태 관리)
            dispatch(logout());

            // 홈 페이지로 리디렉션
            navigate("/");
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    return(
        <NavContainer>
            <ul>
                <li>
                    <Link to={"/sports/soccer"}>운동</Link>
                </li>
                <li>자유</li>
                <li>모집</li>
                <li><Link to={"/"}>홈</Link></li>
                <li>
                    <Link to={"/register"}>
                        회원가입
                    </Link>
                </li>

                {user ? <li onClick={handleLogout}>로그아웃</li> : <li><Link to={"/login"}>로그인</Link></li>}

                {user ? <li><Link to={"/mypage"}>마이페이지</Link></li> : null}

                <li>
                    <Link to={"/shop"}>상점</Link>
                </li>


            </ul>
        </NavContainer>
    )

}

export default Navbar;