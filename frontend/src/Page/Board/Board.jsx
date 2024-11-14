import styled from "styled-components";
import {Link, Outlet, useLocation, useParams} from "react-router-dom";
import SideMenu from "../../Components/Menu/SideMenu";
import {BoardContainer} from "../../styled/Board/BoardPageStyled";
import BoardWrapper from "./BoardWrapper";
import {useEffect, useState} from "react";
import {fetchData} from "../../Server/ApiServiceNoToken";
import {Title} from "../../styled/Common";

function Board() {
    const [boardItem, setBoardItem] = useState([]);
    const { sport } = useParams(); // 경로의 sport 값을 가져옴

    useEffect(() => {
        fetchData("/board/list").then((res) => {
            setBoardItem(res.data);
        });
    }, []);

    // 카테고리 필터링 로직
    const filteredBoardItems = sport
        ? boardItem.filter(item => {
            if (sport === "soccer") return item.category === "축구";
            if (sport === "basketball") return item.category === "농구";
            // 필요한 경우 다른 카테고리를 추가
        })
        : boardItem; // sport 값이 없으면 모든 아이템을 보여줌

    if(boardItem){
        return (
            <BoardContainer>
                <SideMenu />
                <BoardWrapper boardItem={filteredBoardItems} />
            </BoardContainer>
        );
    }else{
        return (
            <div>
                <Title>로딩중...</Title>
            </div>
        )
    }

}

export default Board;
