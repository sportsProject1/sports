import React, { useState } from 'react';
import {
    Author,
    CardWrapper,
    CategoryTag, NavButton,
    PlaceholderIcon,
    PostCard,
    PostContent,
    PostImage, PostTitle,
    SectionContainer
} from "../../styled/main/MainPageStyled";
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";

function MainBestBoard() {
    const [pageIndex, setPageIndex] = useState(0);
    const posts = [
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },

        // 다른 게시글들...
    ];

    const totalPages = Math.ceil(posts.length / 4);

    return (
        <SectionContainer>
            <CardWrapper $translateX={-pageIndex * 100 / totalPages}>
                {posts.map((post, index) => (
                    <PostCard key={post.id + index}>
                        <PostImage>
                            <PlaceholderIcon>📷</PlaceholderIcon>
                            <CategoryTag>{post.category}</CategoryTag>
                        </PostImage>
                        <PostContent>
                            <PostTitle>{post.title}</PostTitle>
                            <Author>{post.author}</Author>
                        </PostContent>
                    </PostCard>
                ))}
            </CardWrapper>
            <NavButton $left={true} onClick={() => setPageIndex(prevIndex => handlePrevSlide(prevIndex, totalPages))}>◀</NavButton>
            <NavButton onClick={() => setPageIndex(prevIndex => handleNextSlide(prevIndex, totalPages))}>▶</NavButton>
        </SectionContainer>
    );
}

export default MainBestBoard;
