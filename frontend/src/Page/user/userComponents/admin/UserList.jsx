import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { lightTheme } from '../../../../styled/theme';
import UserRoleEditor from "./UserRoleEditor";
import { fetchTokenData } from "../../../../Server/ApiService";
import PagePagination from "../../../../Components/Pagination/PagePagination";

// Styled Components
const Container = styled.div`
    padding: 20px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
`;

const Th = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #d3d3d35e;
`;

const Td = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
`;

const ActionTd = styled(Td)`
    text-align: center;
`;

const Button = styled.button`
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background-color: ${(props) => props.theme.colors.secondary};
    }
`;

// 검색 영역
const SearchContainer = styled.div`
    margin-top: 10px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 300px;
`;

const SearchButton = styled(Button)`
    padding: 8px 15px;
`;

const SearchButtonAll = styled(Button)`
    padding: 8px 15px;
    position: relative;
    right:-10px;
`;

// 페이지 네이션



function UserList() {
    const [users, setUsers] = useState([]); // 전체 사용자 데이터 상태
    const [selectedUser, setSelectedUser] = useState(null); // 권한 편집 상태
    const [keyword, setKeyword] = useState(""); // 검색 키워드 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // 현재 페이지의 게시글 슬라이싱을 useMemo로 메모이제이션
    const currentPosts = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return users.slice(indexOfFirstItem, indexOfLastItem);
    }, [users, currentPage, itemsPerPage]);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 사용자 데이터를 가져오는 함수
    const fetchUsers = async () => {
        try {
            const res = await fetchTokenData("/admin/users");
            console.log("Fetched data:", res);
            setUsers(res.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    // **검색 요청 함수 추가**
    const handleSearch = async () => {
        if (!keyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }
        try {
            const res = await fetchTokenData(`/admin/users/search?keyword=${keyword}`);
            setUsers(res.data); // 검색 결과로 사용자 데이터 상태 업데이트
            setCurrentPage(1);
        } catch (error) {
            console.error("Failed to search users:", error);
        }
    };

    // **검색 폼 제출 이벤트 핸들러 (엔터키 처리)**
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        handleSearch(); // 검색 함수 호출
    };

    // **전체보기 버튼 동작 함수**
    const handleShowAll = async () => {
        setKeyword(""); // 검색 키워드 초기화
        fetchUsers(); // 전체 사용자 목록 다시 불러오기
    };

    // 컴포넌트 로드시 사용자 목록 가져오기
    useEffect(() => {
        fetchUsers();
    }, []);

    const openRoleEditor = (user) => {
        setSelectedUser(user);
    };

    const closeRoleEditor = () => {
        setSelectedUser(null);
    };


    return (
        <Container>
            <h1>User Management</h1>

            {/* 검색 및 전체보기 버튼 영역 */}
            <form onSubmit={handleSubmit}>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="이메일 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <SearchButton type="submit">검색</SearchButton>
                    <SearchButtonAll type="button" onClick={handleShowAll}>전체보기</SearchButtonAll>
                </SearchContainer>
            </form>

            <Table>
                <thead>
                    <tr>
                        <Th>고유 ID</Th>
                        <Th>사용자 ID</Th>
                        <Th>이메일</Th>
                        <Th>권한</Th>
                        <Th>설정</Th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.length > 0 ? (
                        currentPosts.map((user) => ( // **currentPosts로 데이터 매핑**
                            <tr key={user.id}>
                                <Td>{user.id}</Td>
                                <Td>{user.username}</Td>
                                <Td>{user.email}</Td>
                                <Td>{user.role}</Td>
                                <ActionTd>
                                    <Button onClick={() => openRoleEditor(user)}>Edit Role</Button>
                                </ActionTd>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <Td colSpan="5" style={{ textAlign: "center" }}>
                                사용자 없음
                            </Td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* 페이지네이션 컴포넌트 */}
            <PagePagination
                totalItems={users.length} // 전체 사용자 수
                currentPage={currentPage} // 현재 페이지
                itemsPerPage={itemsPerPage} // 한 페이지에 표시할 사용자 수
                onPageChange={handlePageChange} // 페이지 변경 핸들러
            />

            {selectedUser && (
                <UserRoleEditor user={selectedUser} onClose={closeRoleEditor} />
            )}
        </Container>
    );
}

export default UserList;
