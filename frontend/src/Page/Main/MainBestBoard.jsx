import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
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
    PlaceholderImg,
    PostTime,
    PostAuthorBox
} from "../../styled/main/MainPageStyled";
import { fetchTokenData } from "../../Server/ApiService";
import { postJsonData } from "../../Server/ApiServiceNoToken";

function MainBestBoard() {
    const [mainBoards, setMainBoards] = useState({}); // 태그별 데이터를 저장
    const [thumbnails, setThumbnails] = useState({}); // 썸네일 데이터를 저장
    const [loading, setLoading] = useState(true); // 로딩 상태
    const navigate = useNavigate();
    const fixedTitlesMap = {
        "운동": "운동 게시판",
        "공지사항": "공지사항",
        "모집": "모집 게시판",
        "자유": "자유 게시판",
    };
    const categoryRoutesMap = {
        "운동": "/board/sports",
        "공지사항": "/board/notice",
        "모집": "/board/recruit",
        "자유": "/board/free",
    };

    useEffect(() => {
        async function fetchMainBoards() {
            try {
                // 메인 게시판 데이터 요청
                const response = await fetchTokenData("/board/main");
                setMainBoards(response.data); // 서버 데이터를 상태로 저장


                // 게시글 ID 목록 추출 (썸네일 요청용)
                const boardIds = Object.values(response.data)
                    .flat()
                    .map((post) => post.id); // 게시글 ID만 추출

                // 썸네일 URL 요청 (토큰 없이 요청)
                const thumbnailData = await postJsonData("/board/thumbnails", boardIds);

                // 썸네일 데이터를 상태로 저장
                const thumbnailsMap = thumbnailData.reduce((acc, { boardId, thumbnailUrl }) => {
                    acc[boardId] = thumbnailUrl; // ID별 썸네일 URL 매핑
                    return acc;
                }, {});

                setThumbnails(thumbnailsMap);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching main boards or thumbnails:", error);
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
            return `· 약 ${diffInHours}시간 전`;
        } else {
            const diffInDays = Math.floor(diffInMinutes / 1440);
            return `${diffInDays}일 전`;
        }
    };

    if (loading) {
        return <p>로딩중...</p>;
    }

    const categories = Object.entries(mainBoards);

    return (
        <PostSectionContainer>
            {categories.map(([categoryName, posts]) => (
                <ListContainer key={categoryName}>
                    <TagTitleContainer onClick={() => navigate(categoryRoutesMap[categoryName] || "/board")}>
                        <div>{fixedTitlesMap[categoryName]}</div>
                    </TagTitleContainer>
                    <PostCardWrapper>
                        {posts.map((post) => {
                            const thumbnailUrl = thumbnails[post.id];
                            const timeElapsed = getTimeElapsed(post.createdAt);
                            const postRoute = `/board/detail/${post.id}`;
                            return (
                                <ListItem key={`${categoryName}-${post.id}`} onClick={() => navigate(postRoute)}>
                                    <ItemLeft>
                                        <img src={thumbnailUrl} alt={`thumbnail ${post.title}`} />
                                    </ItemLeft>
                                    <ItemRight>
                                        <PostCategoryTag>{post.category}</PostCategoryTag>
                                        <PostAuthorBox>
                                            <PostAuthor>{post.author}</PostAuthor>
                                            <PostTime>{timeElapsed}</PostTime>
                                        </PostAuthorBox>
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