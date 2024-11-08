import SubMenu from "../../Components/SubMenu";
import {
    CreateButton,
    CreateButtonContainer,
    ItemContainer,
    PaginationContainer,
    PaginationWrapper
} from "../../styled/Common";
import {
    Author,
    CategoryTag,
    PlaceholderIcon,
    PostCard,
    PostContent,
    PostImage,
    PostTitle
} from "../../styled/main/MainPageStyled";
import React, {useState} from "react";
import Pagination from "../../Components/Pagination/Pagination";
import {ListWrap} from "../../styled/List/ListStyled";
import PagePagination from "../../Components/Pagination/PagePagination";
import {useNavigate} from "react-router-dom";

function BoardWrapper(){

    const navigate = useNavigate();

    const posts = [
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
        { id: 1, category: '홈 트레이닝', title: '효과적인 홈 트레이닝 방법', author: '헬스매니아', date: '2024.05.01', views: 1200 },
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // 현재 페이지의 게시글 슬라이싱
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const onNavigate = () => {
        navigate("/")
    }


    return(
        <ListWrap>
            <SubMenu/>
            <ItemContainer>
                {currentPosts.map((post, index) => (
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

            <PagePagination
            totalItems={posts.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            Text={"글 작성"}
            navigate={onNavigate}/>

        </ListWrap>
    )
}
export default BoardWrapper;