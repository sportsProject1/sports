import styled from "styled-components";
import Menu from "./Menu";
import {useEffect, useState} from "react";

const NavContainer = styled.nav`
    width:100%;
    height: 130px;
`
const NavBox = styled.nav`
        width:100%;
        height: 100px;
        position: fixed;
        display: flex;
        border-bottom: 1px solid #ccc;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
        background-color: #fff;
        transition: transform 0.3s ease;
        transform: ${({ showNavbar }) => (showNavbar ? "translateY(0)" : "translateY(-100%)")};
`

function Navbar(){

    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            setShowNavbar(false);  // 아래로 스크롤 시 Navbar 숨김
        } else {
            setShowNavbar(true);   // 위로 스크롤 시 Navbar 표시
        }

        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        // 컴포넌트 언마운트 시 이벤트 리스너 해제
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);


    return(
        <NavContainer>
            <NavBox showNavbar={showNavbar}>
                <Menu/>
            </NavBox>
        </NavContainer>
    )

}

export default Navbar;