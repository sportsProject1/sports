import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {CardType, ListType} from "../../Store/ItemTypeSlice";

// 서브메뉴 전체 컨테이너
const SubMenuContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    justify-content: space-between;
    width: 100%;
    background-color: #f9f9f9;
`;

// 검색창 스타일
const SearchInputWrapper = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 50px;
    padding: 5px 15px;
    background-color: #fff;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    font-size: 16px;
    width: 250px;
    margin-right: 10px;
    padding: 8px;
`;

const SearchIcon = styled.span`
    font-size: 18px;
    color: #333;
    cursor: pointer;
`;

// 필터 버튼 스타일
const FilterButton = styled.button.withConfig({
    shouldForwardProp: (prop) => prop !== "$active",
})`
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    background-color: ${({ $active }) => ($active ? "#333" : "#f5f5f5")};
    color: ${({ $active }) => ($active ? "#fff" : "#333")};
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e0e0e0;
    }
`;

function SubMenu({handleItemType, handleSortChange, isShop = false, sortOption }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeButton, setActiveButton] = useState(sortOption || "latest");  // sortOption으로 초기화
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 검색어를 URL로 전달하는 함수
    const handleSearch = () => {
        if (searchQuery.trim()) {
            const path = window.location.pathname.includes("/board") ? "/board" : "/shop";
            navigate(`${path}/search?keyword=${searchQuery}`);
        }
    };

    // 필터 버튼 클릭 시 처리 함수
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName); // 버튼 활성화 상태 업데이트
        handleSortChange(buttonName); // 정렬 변경 처리
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // sortOption이 변경될 때마다 activeButton을 동기화
    useEffect(() => {
        setActiveButton(sortOption);
    }, [sortOption]);

    return (
        <SubMenuContainer>
            {/* 검색창 */}
            <SearchInputWrapper>
                <SearchInput
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
                    placeholder="검색어를 입력하세요"
                />
                <SearchIcon onClick={handleSearch}>🔍</SearchIcon>
            </SearchInputWrapper>

            {/* 필터 버튼들 */}
            <div>
                {isShop ? (
                    // Shop용 필터 버튼 (가격순, 좋아요순)
                    <>
                        <FilterButton
                            $active={activeButton === "latest"}
                            onClick={() => handleButtonClick("latest")}
                        >
                            최신순
                        </FilterButton>
                        <FilterButton
                            $active={activeButton === "priceDesc"}
                            onClick={() => handleButtonClick("priceDesc")}
                        >
                            높은 가격순
                        </FilterButton>
                        <FilterButton
                            $active={activeButton === "priceAsc"}
                            onClick={() => handleButtonClick("priceAsc")}
                        >
                            낮은 가격순
                        </FilterButton>
                        <FilterButton
                            $active={activeButton === "likes"}
                            onClick={() => handleButtonClick("likes")}
                        >
                            좋아요순
                        </FilterButton>
                    </>
                ) : (
                    // Board용 필터 버튼 (최신순, 오래된순, 조회수순, 좋아요순)
                    <>
                        <FilterButton onClick={()=>dispatch(CardType())}>
                            카드형
                        </FilterButton>
                        <FilterButton onClick={()=>dispatch(ListType())}>
                            리스트형
                        </FilterButton>
                        <FilterButton
                            $active={activeButton === "latest"}
                            onClick={() => handleButtonClick("latest")}
                        >
                            최신순
                        </FilterButton>
                        <FilterButton
                            $active={activeButton === "oldest"}
                            onClick={() => handleButtonClick("oldest")}
                        >
                            오래된순
                        </FilterButton>
                        <FilterButton
                            $active={activeButton === "views"}
                            onClick={() => handleButtonClick("views")}
                        >
                            조회수순
                        </FilterButton>
                        <FilterButton
                            $active={activeButton === "likes"}
                            onClick={() => handleButtonClick("likes")}
                        >
                            좋아요순
                        </FilterButton>
                    </>
                )}
            </div>
        </SubMenuContainer>
    );
}

export default SubMenu;