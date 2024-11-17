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
    const [category, setCategory] = useState();

    useEffect(() => {
        fetchData("/board/list").then((res) => {
            setBoardItem(res.data);
        });
        fetchData("/category/get").then((res)=>{
            setCategory(res.data);
        })
    }, []);

    // 카테고리 필터링 로직
    const filteredBoardItems = sport
        ? boardItem.filter(item => {
            // category에서 sport와 일치하는 enName을 가진 카테고리를 찾음
            const matchedCategory = category?.find(cat => cat.enName === sport);
            return matchedCategory ? item.category === matchedCategory.name : false;
        })
        : boardItem; // sport 값이 없으면 모든 아이템을 보여줌
    console.log(boardItem)

    const sportCategories = category?.filter(item => item.tag === 'sports');

    if(boardItem){
        return (
            <BoardContainer>
                <SideMenu params={"/board"} category={sportCategories} />
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
