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
import { fetchData, postJsonData } from "../../Server/ApiServiceNoToken";

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
        "운동": "/board",
        "공지사항": "/board/notice",
        "모집": "/board/recruit",
        "자유": "/board/free",
    };

    useEffect(() => {
        async function fetchMainBoards() {
            try {
                // 메인 게시판 데이터 요청
                const response = await fetchData("/board/main");
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

        // UTC를 한국 시간(Asia/Seoul)으로 변환
        const utcTime = createdTime.toISOString();  // DB에서 받은 시간을 ISO 형식으로 변환
        const createdTimeInKST = new Date(utcTime);  // 해당 UTC 시간을 새로 Date 객체로 생성

        // UTC 시간을 한국 시간대로 변환 (KST)
        const timeZoneOffset = 9 * 60; // 한국 시간대는 UTC+9
        createdTimeInKST.setMinutes(createdTimeInKST.getMinutes() + timeZoneOffset);  // 타임존 보정

        const now = new Date(); // 현재 시간을 가져옴
        const nowInKST = new Date(now.getTime() + timeZoneOffset); // 현재 시간도 한국 시간대로 보정

        // 시간 차이 계산 (밀리초 단위)
        const diffInMs = nowInKST - createdTimeInKST;
        const diffInMinutes = Math.floor(diffInMs / 60000); // 밀리초를 분으로 변환

        // 시간 차이에 따른 출력
        if (diffInMinutes < 60) {
            return `· ${diffInMinutes}분 전`;
        } else if (diffInMinutes < 1440) {
            const diffInHours = Math.floor(diffInMinutes / 60);
            return `· 약 ${diffInHours}시간 전`;
        } else {
            const diffInDays = Math.floor(diffInMinutes / 1440);
            return `· ${diffInDays}일 전`;
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
                                        <img src={thumbnailUrl} alt={`thumbnail ${post.title}`} style={{ width: '100%',objectFit: 'contain'}} />
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