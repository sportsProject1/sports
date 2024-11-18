import styled from "styled-components";
import {Link, Outlet, useLocation, useParams} from "react-router-dom";
import SideMenu from "../../Components/Menu/SideMenu";
import {BoardContainer} from "../../styled/Board/BoardPageStyled";
import BoardWrapper from "./BoardWrapper";
import {useEffect, useState, useMemo} from "react";
import {fetchData} from "../../Server/ApiServiceNoToken";
import {Title} from "../../styled/Common";

function Board() {
    const [boardItem, setBoardItem] = useState([]);
    const { sport } = useParams(); // 경로의 sport 값을 가져옴
    const [category, setCategory] = useState();
    const [sortOption, setSortOption] = useState('latest');

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const boardResponse = await fetchData("/board/list");
                setBoardItem(boardResponse.data);
                const categoryResponse = await fetchData("/category/get");
                setCategory(categoryResponse.data);
            } catch (error) {
                console.error("데이터 로딩 중 오류:", error);
            }
        };
        fetchBoardData();
    }, []);

    // 카테고리 필터링 로직
    const filteredBoardItems = useMemo(() => {
        return sport
            ? boardItem.filter(item => {
                const matchedCategory = category?.find(cat => cat.enName === sport);
                return matchedCategory ? item.category === matchedCategory.name : false;
            })
            : boardItem;
    }, [boardItem, category, sport]);

    // 정렬 로직
    const sortedBoardItems = useMemo(() => {
        return [...filteredBoardItems].sort((a, b) => {
            switch (sortOption) {
                case 'latest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'views':
                    return b.views - a.views;
                case 'likes':
                    return b.likes - a.likes;
                default:
                    return 0;
            }
        });
    }, [filteredBoardItems, sortOption]);

    const sportCategories = useMemo(() => category?.filter(item => item.tag === 'sports'), [category]);
    const etcCategories = useMemo(() => category?.filter(item => item.tag === 'etc'), [category]);

    const handleSortChange = (sortOption) => {
        setSortOption(sortOption);
    };

    if (boardItem.length === 0) {
        return (
            <div>
                <Title>로딩중...</Title>
            </div>
        );
    }

    return (
        <BoardContainer>
            <SideMenu
                params={"/board"}
                category={sportCategories}
                categoryTitle={"운동 이야기"}
                subCategoryTitle={"그 외"}
                subCategory={etcCategories}
            />
            <BoardWrapper handleSortChange={handleSortChange} boardItem={sortedBoardItems} />
        </BoardContainer>
    );
}

export default Board;
