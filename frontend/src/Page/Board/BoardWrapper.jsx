import SubMenu from "../../Components/SubMenu";
import {BoardWrap} from "../../styled/Board/BoardPageStyled";
import {ItemBox, ItemContainer} from "../../styled/Common";
import {
    Author,
    CategoryTag,
    PlaceholderIcon,
    PostCard,
    PostContent,
    PostImage,
    PostTitle
} from "../../styled/main/MainPageStyled";
import React from "react";

function BoardWrapper(){
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
    return(
        <BoardWrap>
            <SubMenu/>
            <ItemContainer>
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
            </ItemContainer>

        </BoardWrap>
    )
}
export default BoardWrapper;