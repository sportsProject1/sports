import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
    shouldForwardProp: (prop) => prop !== '$active'
})`
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    background-color: ${({ $active }) => ($active ? '#333' : '#f5f5f5')};
    color: ${({ $active }) => ($active ? '#fff' : '#333')};
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e0e0e0;
    }
`;

function SubMenu({ handleSortChange }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeButton, setActiveButton] = useState("latest");
    const navigate = useNavigate();

    // 검색어를 URL로 전달하는 함수
    const handleSearch = () => {
        if (searchQuery.trim()) {
            // 현재 페이지가 /board 인지 /shop 인지에 따라 적절한 경로로 이동
            const path = window.location.pathname.includes('/board') ? '/board' : '/shop';
            navigate(`${path}/search?keyword=${searchQuery}`);
        }
    };

    // 필터 버튼 클릭 시 처리 함수
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
        handleSortChange(buttonName); // 버튼 클릭 시 정렬 함수 호출, 버튼 이름을 그대로 전달
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

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
            </div>
        </SubMenuContainer>
    );
}

export default SubMenu;