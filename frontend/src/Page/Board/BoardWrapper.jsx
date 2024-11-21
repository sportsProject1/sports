import SubMenu from "../../Components/Menu/SubMenu";
import { ItemContainer } from "../../styled/Common";
import {
    Author,
    CategoryTag, PlaceholderImg,
    PostCard,
    BoardPostImage,
    PostTitle
} from "../../styled/main/MainPageStyled";
import React, { useMemo, useState } from "react";
import { ListWrap, PostInfo, PostContent } from "../../styled/List/ListStyled"; /////******** */
import PagePagination from "../../Components/Pagination/PagePagination";
import { useNavigate } from "react-router-dom";

function BoardWrapper({ boardItem, handleSortChange }) {
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

    // 콘텐츠에서 첫 번째 이미지 URL 가져오기
    const extractFirstImageUrl = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const imgTag = doc.querySelector("img");
        return imgTag ? imgTag.src : null;
    };

    const formatTimeAgo = (createdAt) => {
        const createdTime = new Date(createdAt);
        const now = new Date();
        const diffInMinutes = Math.floor((now - createdTime) / 60000);

        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}시간 전`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}일 전`;
        }
    };

    const formatDate = (createdAt) => {
        const createdTime = new Date(createdAt);
        return createdTime.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const onNavigate = () => {
        navigate("/board/add");
    };

    return (
        <ListWrap>
            <SubMenu handleSortChange={handleSortChange} />
            <ItemContainer>
                {currentPosts.map((post) => {
                    const thumbnailUrl = extractFirstImageUrl(post.content);
                    const timeAgo = formatTimeAgo(post.createdAt);
                    const formattedDate = formatDate(post.createdAt);

                    return (
                        <PostCard onClick={() => navigate(`/board/detail/${post.id}`)} key={post.id}>
                            <BoardPostImage>
                                {thumbnailUrl ? (
                                    <img
                                        src={thumbnailUrl}
                                        alt={`thumbnail ${post.title}`}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                ) : (
                                    <PlaceholderImg />
                                )}
                                <CategoryTag>{post.category}</CategoryTag>
                            </BoardPostImage>
                            <PostContent>
                                <PostTitle>{post.title}</PostTitle>
                                <Author>{post.author}</Author>
                                <PostInfo>
                                    <span className="time-ago">{timeAgo}</span>
                                    <div className="details">
                                        <span> 👀 {post.views}</span>
                                        <span>{post.likes > 0 ? "❤️" : "🤍"} {post.likes}</span>
                                    </div>
                                </PostInfo>
                                <div style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}>
                                    {formattedDate}
                                </div>
                            </PostContent>
                        </PostCard>
                    );
                })}
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
