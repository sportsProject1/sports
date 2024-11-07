// 서브메뉴 전체 컨테이너
import styled from "styled-components";

const SubMenuContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px 20px;
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

// 필터 버튼 스타일
const FilterButton = styled.button`
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    background-color: ${({ active }) => (active ? '#333' : '#f5f5f5')};
    color: ${({ active }) => (active ? '#fff' : '#333')};
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e0e0e0;
    }
`;

function SubMenu(props) {
    return (
        <SubMenuContainer>
            {/* 검색창 */}
            <SearchInputWrapper>
                <SearchInput placeholder="Search" />
                <SearchIcon>🔍</SearchIcon>
            </SearchInputWrapper>

            {/* 필터 버튼들 */}
            <div>
                <FilterButton active>New</FilterButton>
                <FilterButton>Price ascending</FilterButton>
                <FilterButton>Price descending</FilterButton>
                <FilterButton>Rating</FilterButton>
            </div>
        </SubMenuContainer>
    )
}
export default SubMenu;