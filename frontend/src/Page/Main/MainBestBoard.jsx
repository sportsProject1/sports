import React, { useState } from 'react';
import {
    Author,
    CardWrapper,
    CategoryTag, NavButton,
    BoardImg,
    PostCard,
    PostContent,
    PostImage, PostTitle,
    SectionContainer,
    ListContainer,
    ListItem,
    ItemLeft,
    ItemRight,
} from "../../styled/main/MainPageStyled";

import movologo from "../../assets/movologo.png";
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";

function MainBestBoard() {
    const [pageIndex, setPageIndex] = useState(0);
    const posts = [
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200, img: movologo },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200, img: movologo },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200, img: movologo },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200, img: movologo },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200, img: movologo },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200, img: movologo },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200, img: movologo },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200, img: movologo },

        // 다른 게시글들...
    ];

    const totalPages = Math.ceil(posts.length / 4);

    return (
        <SectionContainer>
            <ListContainer>
            <CardWrapper $translateX={-pageIndex * 100 / totalPages}>
                {posts.map((post, index) => (
                    <ListItem key={post.id + index}>
                        <ItemLeft>
                            <BoardImg src={post.img} alt="Logo Image"/>
                            <CategoryTag>{post.category}</CategoryTag>
                        </ItemLeft>
                        <ItemRight>
                            <PostTitle>{post.title}</PostTitle>
                            <Author>{post.author}</Author>
                        </ItemRight>
                    </ListItem>
                ))}
            </CardWrapper>
            <NavButton $left={true} onClick={() => setPageIndex(prevIndex => handlePrevSlide(prevIndex, totalPages))}>◀</NavButton>
            <NavButton onClick={() => setPageIndex(prevIndex => handleNextSlide(prevIndex, totalPages))}>▶</NavButton>
            </ListContainer>
        </SectionContainer>
    );
}

export default MainBestBoard;
