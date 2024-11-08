import styled from "styled-components";
import Navbar from "../Components/nav/Navbar";
import {Outlet} from "react-router-dom";
import Footer from "../Components/Footer/Footer";

const Container = styled.div`

`

export default function Layout(){

    return(
        <Container>
            <Navbar/>

            <Outlet/>
            <Footer/>
        </Container>
    )
}