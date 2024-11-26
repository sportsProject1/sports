import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchData } from "../../Server/ApiServiceNoToken";
import { fetchTokenData } from "../../Server/ApiService";
import { BoardContainer } from "../../styled/Board/BoardPageStyled";
import SideMenu from "../../Components/Menu/SideMenu";
import BoardWrapper from "./BoardWrapper";
import { Title } from "../../styled/Common";
import useLikeStatus from "../../hooks/useLikeStatus";
import NoItemBoardWrapper from "./NoItemBoardWrapper";

function Board() {
    const [boardItem, setBoardItem] = useState([]); // 전체 게시글 데이터
    const { sport } = useParams(); // URL 파라미터에서 sport 값 가져오기
    const [category, setCategory] = useState([]); // 카테고리 데이터
    const [sortOption, setSortOption] = useState('latest'); // 정렬 옵션
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [isSearchMode, setIsSearchMode] = useState(false); // 검색 상태를 관리
    const navigate = useNavigate();
    const location = useLocation();

    // 게시글 ID 추출
    const boardIds = useMemo(() => boardItem.map((item) => item.id), [boardItem]);
    const { likeStatus, error } = useLikeStatus(boardIds, "Board", "board");

    // 검색어 업데이트 (URL에서 검색어 추출)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        if (keyword) {
            setSearchQuery(keyword);
            setIsSearchMode(true); // 검색 상태 활성화
        } else {
            setSearchQuery('');
            setIsSearchMode(false); // 검색 상태 비활성화
        }
    }, [location]);

    // 데이터 로드
    useEffect(() => {
        if (isSearchMode && searchQuery.trim()) {
            // 검색 모드일 때
            fetchData(`/board/search?keyword=${searchQuery}`).then((res) => {
                setBoardItem(res.data);
            });
        } else {
            // 일반 모드일 때
            fetchData("/board/list").then((res) => {
                setBoardItem(res.data);
            });
        }
        // 카테고리 데이터 로드
        fetchData("/category/get").then((res) => {
            setCategory(res.data);
        });
    }, [isSearchMode, searchQuery]);

    // 카테고리 필터링 로직
    const filterByCategory = useMemo(() => {
        if (sport === undefined || sport === "board") {
            // "모두 보기" 상태: tag가 "운동"인 게시글만 필터링
            return boardItem.filter(item => {
                const matchedCategory = category.find(cat => cat.name === item.category);
                return matchedCategory?.tag === "운동";
            });
        }

        // 특정 카테고리 상태
        const matchedCategory = category.find(cat => cat.enName === sport);
        if (matchedCategory) {
            return boardItem.filter(item => item.category === matchedCategory.name);
        }

        return boardItem;
    }, [boardItem, category, sport]);

    // 검색어로 필터링 (제목 기준)
    const filterBySearchQuery = useMemo(() => {
        if (!searchQuery.trim() || !isSearchMode) return filterByCategory;

        return filterByCategory.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [filterByCategory, searchQuery, isSearchMode]);

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

    // '운동' 태그가 있는 카테고리만 필터링
    const sportCategories = useMemo(() => {
        return category.filter(item => item.tag === "운동" && item.enName); // '운동' 태그 및 enName이 있는 항목만 필터링
    }, [category]);

    // '기타' 태그가 있는 카테고리만 필터링
    const etcCategories = useMemo(() => {
        return category.filter(item => item.tag === "etc"); // '기타' 태그가 있는 카테고리
    }, [category]);

    const handleSortChange = (sortOption) => {
        setSortOption(sortOption);
    };

    // 검색 상태 해제 (검색 초기화 함수)
    const clearSearch = () => {
        navigate("/board"); // 검색어를 제거하고 전체 게시글로 돌아갑니다.
        setSearchQuery('');
        setIsSearchMode(false);
    };

    return (
        <BoardContainer>
            <SideMenu
                params={"/board"}
                category={sportCategories}
                categoryTitle={"운동 이야기"}
                subCategoryTitle={"그 외"}
                subCategory={etcCategories}
            />
            {boardItem.length === 0 ? (
                <NoItemBoardWrapper handleSortChange={handleSortChange} />
            ) : (
                <BoardWrapper
                    handleSortChange={handleSortChange}
                    boardItem={sortedBoardItems}
                    likeStatus={likeStatus}
                    onClearSearch={clearSearch} // 검색 초기화 함수 전달
                />
            )}
        </BoardContainer>
    );
}

export default Board;
