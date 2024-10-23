import styled from "styled-components";
import Navbar from "../Components/Navbar";
import {Outlet} from "react-router-dom";

const Container = styled.div`

`

export default function Layout(){

    return(
        <Container>
            <Navbar/>

            <Outlet/>
        </Container>
    )
}