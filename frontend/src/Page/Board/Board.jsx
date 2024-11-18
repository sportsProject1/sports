import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchData } from "../../Server/ApiServiceNoToken";
import { BoardContainer } from "../../styled/Board/BoardPageStyled";
import SideMenu from "../../Components/Menu/SideMenu";
import BoardWrapper from "./BoardWrapper";
import { Title } from "../../styled/Common";

function Board() {
    const [boardItem, setBoardItem] = useState([]);
    const { sport } = useParams(); // URL 파라미터에서 sport 값 가져오기
    const [category, setCategory] = useState([]);
    const [sortOption, setSortOption] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // 쿼리 파라미터에서 검색어 추출
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        if (keyword) {
            setSearchQuery(keyword);
        }
    }, [location]);

    // 데이터 요청 (전체 게시글과 카테고리 가져오기)
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                let boardResponse;
                if (searchQuery.trim()) {
                    // 검색어가 있을 때 제목(title)만 기준으로 검색 API 호출
                    boardResponse = await fetchData(`/board/search?keyword=${searchQuery}`);
                } else {
                    // 검색어가 없을 때 전체 게시글 가져오기
                    boardResponse = await fetchData("/board/list");
                }
                setBoardItem(boardResponse.data);

                // 카테고리 데이터 가져오기
                const categoryResponse = await fetchData("/category/get");
                setCategory(categoryResponse.data); // 카테고리 데이터를 가져옵니다.
            } catch (error) {
                console.error("데이터 로딩 중 오류:", error);
            }
        };

        fetchBoardData();
    }, [searchQuery]);  // 검색어가 변경될 때마다 실행

    // 카테고리 필터링 로직
    const filterByCategory = useMemo(() => {
        if (!sport || !category) return boardItem;

        const matchedCategory = category.find(cat => cat.enName === sport);
        if (matchedCategory) {
            return boardItem.filter(item => item.category === matchedCategory.name);
        }
        return boardItem;
    }, [boardItem, category, sport]);

    // 검색어로 필터링 (제목 기준)
    const filterBySearchQuery = useMemo(() => {
        if (!searchQuery.trim()) return filterByCategory;

        return filterByCategory.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [filterByCategory, searchQuery]);

    // 정렬 로직
    const sortedBoardItems = useMemo(() => {
        return [...filterBySearchQuery].sort((a, b) => {
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
    }, [filterBySearchQuery, sortOption]);

    // 'sports' 태그가 있는 카테고리만 필터링
    const sportCategories = useMemo(() => {
        return category.filter(item => item.tag === "sports" && item.enName); // 'sports' 태그 및 enName이 있는 항목만 필터링
    }, [category]);

    // 'etc' 태그가 있는 카테고리만 필터링
    const etcCategories = useMemo(() => {
        return category.filter(item => item.tag === "etc"); // 'etc' 태그가 있는 카테고리
    }, [category]);

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