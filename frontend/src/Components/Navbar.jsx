import styled from "styled-components";
import {Link} from "react-router-dom";

const NavContainer = styled.nav`
    width:100%;
    height: 100px;
    background-color: green;
    display: flex;
    > ul{
        display: flex;
        align-items: center;
    }
    > ul li{
        list-style: none;
        margin:15px;
        padding:15px;
        background-color: #61dafb;
        cursor: pointer;
    }
`

function Navbar(){

    return(
        <NavContainer>
            <ul>
                <li>
                    <Link to={"/sports"}>운동</Link>
                </li>
                <li>자유</li>
                <li>모집</li>
                <li>
                    <Link to={"/register"}>
                        회원가입
                    </Link>
                </li>
                
                <li>
                    <Link to={"/login"}>로그인</Link>
                </li>
                

            </ul>
        </NavContainer>
    )

}

export default Navbar;