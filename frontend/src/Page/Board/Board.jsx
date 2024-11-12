import styled from "styled-components";
import {Link, Outlet} from "react-router-dom";
import SideMenu from "../../Components/Menu/SideMenu";
import {BoardContainer} from "../../styled/Board/BoardPageStyled";
import BoardWrapper from "./BoardWrapper";

function Board(){
    return(
        <BoardContainer>
            <SideMenu/>
            <BoardWrapper/>
        </BoardContainer>
    )
}

export default Board;