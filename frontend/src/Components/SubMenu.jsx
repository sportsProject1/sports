import React, { useState } from "react";
import styled from "styled-components";

// 서브메뉴 전체 컨테이너
const SubMenuContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    justify-content: space-between;
    width: 100%;
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
    width: 150px;
    margin-right: 10px;
`;

const SearchIcon = styled.span`
    font-size: 16px;
    color: #333;
`;

// 필터 버튼 스타일 (styled-components prop 전달 방지 처리)
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

function SubMenu() {
    const [activeButton, setActiveButton] = useState("New");

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <SubMenuContainer>
            {/* 검색창 */}
            <SearchInputWrapper>
                <SearchInput placeholder="Search" />
                <SearchIcon>🔍</SearchIcon>
            </SearchInputWrapper>

            {/* 필터 버튼들 */}
            <div>
                <FilterButton
                    $active={activeButton === "New"}
                    onClick={() => handleButtonClick("New")}
                >
                    New
                </FilterButton>
                <FilterButton
                    $active={activeButton === "Price ascending"}
                    onClick={() => handleButtonClick("Price ascending")}
                >
                    Price ascending
                </FilterButton>
                <FilterButton
                    $active={activeButton === "Price descending"}
                    onClick={() => handleButtonClick("Price descending")}
                >
                    Price descending
                </FilterButton>
                <FilterButton
                    $active={activeButton === "Rating"}
                    onClick={() => handleButtonClick("Rating")}
                >
                    Rating
                </FilterButton>
            </div>
        </SubMenuContainer>
    );
}

export default SubMenu;
