import React, { useEffect, useState } from 'react';
import {
    PostCardWrapper,
    PostSectionContainer,
    ListContainer,
    TagTitleContainer,
    ListItem,
    ItemLeft,
    ItemRight,
    BoardImg,
    PostCategoryTag,
    PostPostTitle,
    PostAuthor,
    PlaceholderImg
} from "../../styled/main/MainPageStyled";
import { fetchTokenData } from "../../Server/ApiService";

function MainBestBoard() {
    const [mainBoards, setMainBoards] = useState({}); // 태그별 데이터를 저장
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        async function fetchMainBoards() {
            try {
                const response = await fetchTokenData('/board/main');
                setMainBoards(response.data); // 응답 데이터를 상태로 저장
                setLoading(false);
            } catch (error) {
                console.error('Error fetching main boards:', error);
                setLoading(false);
            }
        }

        fetchMainBoards();
    }, []);

    // 콘텐츠에서 첫 번째 이미지 URL 가져오기
    const extractFirstImageUrl = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const imgTag = doc.querySelector("img");
        return imgTag ? imgTag.src : null;
    };

    // 시간표시 함수
    const getTimeElapsed = (createdAt) => {
        const createdTime = new Date(createdAt);
        const now = new Date();
        const diffInMs = now - createdTime;
        const diffInMinutes = Math.floor(diffInMs / 60000); // 밀리초를 분으로 변환

        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`;
        } else if (diffInMinutes < 1440) {
            const diffInHours = Math.floor(diffInMinutes / 60);
            return `약 ${diffInHours}시간 전`;
        } else {
            const diffInDays = Math.floor(diffInMinutes / 1440);
            return `${diffInDays}일 전`;
        }
    };


    if (loading) {
        return <p>로딩중...</p>;
    }

    return (
        <PostSectionContainer>
            {Object.entries(mainBoards).map(([tag, posts]) => (
                <ListContainer key={tag}>
                    <TagTitleContainer>
                        <div>{tag} 게시판</div>
                    </TagTitleContainer>
                    <PostCardWrapper>
                        {posts.map((post) => {
                            const thumbnailUrl = extractFirstImageUrl(post.content);
                            const timeElapsed = getTimeElapsed(post.createdAt);
                            return (
                                <ListItem key={post.id}>
                                    <ItemLeft>
                                        {thumbnailUrl ? (
                                            <img
                                                src={thumbnailUrl}
                                                alt={`thumbnail ${post.title}`}
                                            />
                                        ) : (
                                            <PlaceholderImg />
                                        )}
                                    </ItemLeft>
                                    <ItemRight>
                                        <PostCategoryTag>{post.category}</PostCategoryTag>
                                        <PostAuthor>{post.author}</PostAuthor>
                                        <span>{timeElapsed}</span>
                                        <PostPostTitle>{post.title}</PostPostTitle>
                                    </ItemRight>
                                </ListItem>
                            );
                        })}
                    </PostCardWrapper>
                </ListContainer>
            ))}
        </PostSectionContainer>
    );
}

export default MainBestBoard;