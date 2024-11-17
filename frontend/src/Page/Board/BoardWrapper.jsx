import SubMenu from "../../Components/Menu/SubMenu";
import { ItemContainer } from "../../styled/Common";
import {
    Author,
    CategoryTag,
    PlaceholderImg,
    PostCard,
    PostContent,
    PostImage,
    PostTitle
} from "../../styled/main/MainPageStyled";
import React, { useMemo, useState } from "react";
import { ListWrap } from "../../styled/List/ListStyled";
import PagePagination from "../../Components/Pagination/PagePagination";
import { useNavigate } from "react-router-dom";

function BoardWrapper({ boardItem }) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // 현재 페이지의 게시글 슬라이싱을 useMemo로 메모이제이션
    const currentPosts = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return boardItem.slice(indexOfFirstItem, indexOfLastItem);
    }, [boardItem, currentPage, itemsPerPage]);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const onNavigate = () => {
        navigate("/board/add");
    };

    return (
        <ListWrap>
            <SubMenu />
            <ItemContainer>
                {currentPosts.map((post) => (
                    <PostCard onClick={() => navigate(`/board/detail/${post.id}`)} key={post.id}>
                        <PostImage>
                            <PlaceholderImg />
                            <CategoryTag>{post.category}</CategoryTag>
                        </PostImage>
                        <PostContent>
                            <PostTitle>{post.title}</PostTitle>
                            <Author>{post.author}</Author>
                        </PostContent>
                    </PostCard>
                ))}
            </ItemContainer>

            <PagePagination
                totalItems={boardItem.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                Text={"글 작성"}
                navigate={onNavigate}
            />
        </ListWrap>
    );
}

export default BoardWrapper;
