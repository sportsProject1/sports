import SubMenu from "../../Components/Menu/SubMenu";
import {ItemContainer} from "../../styled/Common";
import React, {useEffect, useMemo, useState} from "react";
import {ListWrap} from "../../styled/List/ListStyled"; /////******** */
import PagePagination from "../../Components/Pagination/PagePagination";
import {useNavigate} from "react-router-dom";
import {postJsonData} from "../../Server/ApiServiceNoToken";
import BoardCardType from "./BoardCard";
import BoardListType from "./BoardListType";
import {useSelector} from "react-redux";

function BoardWrapper({ boardItem, handleSortChange, likeStatus }) {
    const itemViewType = useSelector((state)=>state.itemType.itemType)
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [thumbnails, setThumbnails] = useState({});

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

    // 썸네일 요청 로직 추가
    useEffect(() => {
        async function fetchThumbnails() {
            try {
                const boardIds = boardItem.map((post) => post.id); // 모든 게시글 ID 추출
                const thumbnailData = await postJsonData("/board/thumbnails", boardIds);

                // ID별 썸네일 URL 매핑
                const thumbnailsMap = thumbnailData.reduce((acc, { boardId, thumbnailUrl }) => {
                    acc[boardId] = thumbnailUrl;
                    return acc;
                }, {});

                setThumbnails(thumbnailsMap); // 썸네일 데이터 상태로 저장
            } catch (error) {
                console.error("Error fetching thumbnails:", error);
            }
        }

        fetchThumbnails();
    }, [boardItem]);

    const formatTimeAgo = (createdAt) => {
        const createdTime = new Date(createdAt);  // DB에서 받은 시간을 그대로 사용

        // UTC를 한국 시간(Asia/Seoul)으로 변환
        const utcTime = createdTime.toISOString();  // DB에서 받은 시간을 ISO 형식으로 변환
        const createdTimeInKST = new Date(utcTime);  // 해당 UTC 시간을 새로 Date 객체로 생성

        // UTC 시간을 한국 시간대로 변환 (KST)
        const timeZoneOffset = 9 * 60; // 한국 시간대는 UTC+9
        createdTimeInKST.setMinutes(createdTimeInKST.getMinutes() + timeZoneOffset);  // 타임존 보정

        const now = new Date(); // 현재 시간을 가져옴
        const nowInKST = new Date(now.getTime() + timeZoneOffset); // 현재 시간도 한국 시간대로 보정

        // 시간 차이 계산 (분 단위)
        const diffInMinutes = Math.floor((nowInKST - createdTimeInKST) / 60000);

        // 시간 차이에 따른 출력
        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}시간 전`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}일 전`;
        }
    };


    const formatDate = (createdAt) => {
        const createdTime = new Date(createdAt); // DB에서 받은 시간을 그대로 사용

        // UTC를 한국 시간(Asia/Seoul)으로 변환
        const utcTime = createdTime.toISOString();  // DB에서 받은 시간을 ISO 형식으로 변환
        const createdTimeInKST = new Date(utcTime);  // 해당 UTC 시간을 새로 Date 객체로 생성

        // UTC 시간을 한국 시간대로 변환 (KST)
        const timeZoneOffset = 9 * 60; // 한국 시간대는 UTC+9
        createdTimeInKST.setMinutes(createdTimeInKST.getMinutes() + timeZoneOffset);  // 타임존 보정

        // 오전/오후 계산
        const hours = createdTimeInKST.getHours();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12; // 12시를 0시로 처리
        const minutes = createdTimeInKST.getMinutes().toString().padStart(2, '0'); // 두 자리로 맞춤

        // 날짜, 월, 년 추출
        const year = createdTimeInKST.getFullYear();
        const month = (createdTimeInKST.getMonth() + 1).toString().padStart(2, '0');
        const day = createdTimeInKST.getDate().toString().padStart(2, '0');

        return `${year}년 ${month}월 ${day}일 ${ampm} ${formattedHours}:${minutes}`;
    };

    const onNavigate = () => {
        navigate("/board/add");
    };

    return (
        <ListWrap>
            <SubMenu handleSortChange={handleSortChange} />
            <ItemContainer>
                {currentPosts.map((post) => {
                    const thumbnailUrl = thumbnails[post.id];
                    const timeAgo = formatTimeAgo(post.createdAt);
                    const formattedDate = formatDate(post.createdAt);
                    const isLiked = likeStatus[post.id];

                    return itemViewType === "card" ? <BoardCardType
                            key={post.id}
                            post={post}
                            thumbnailUrl={thumbnailUrl}
                            timeAgo={timeAgo}
                            formattedDate={formattedDate}
                            isLiked={isLiked}
                        /> : <BoardListType key={post.id}
                                            post={post}
                                            thumbnailUrl={thumbnailUrl}
                                            timeAgo={timeAgo}
                                            formattedDate={formattedDate}
                                            isLiked={isLiked}/>
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
