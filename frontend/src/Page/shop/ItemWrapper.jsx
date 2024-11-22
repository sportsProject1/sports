import { ListWrap } from "../../styled/List/ListStyled";
import SubMenu from "../../Components/Menu/SubMenu";
import React, { useMemo, useState } from "react";
import { Card, ItemContainer, Price, ProductName, CardImage, PriceContainer, LikeCount, BrandName } from "../../styled/Common";
import { useNavigate } from "react-router-dom";
import PagePagination from "../../Components/Pagination/PagePagination";

function ItemWrapper({ items, likeStatus }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const navigate = useNavigate();

    // 현재 페이지의 게시글 슬라이싱을 useMemo로 메모이제이션
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return items.slice(indexOfFirstItem, indexOfLastItem);
    }, [items, currentPage, itemsPerPage]);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const onNavigate = () => {
        navigate("/shop/add");
    };

    return (
        <ListWrap>
            <SubMenu />
            <ItemContainer>
                {currentItems.map((item) => {
                    const isLiked = likeStatus[item.id];
                    return (
                        <Card key={item.id} onClick={() => navigate(`/shop/detail/${item.id}`)}>
                            <CardImage
                                    src={item.imgurl ? item.imgurl.split(',')[0] : 'default-image-url.jpg'}
                                    alt={item.name}
                                />
                            <ProductName>{item.title}</ProductName>
                            <BrandName>{item.nickname}</BrandName>
                            <PriceContainer>
                                <Price>{item.price.toLocaleString()}원</Price>
                                <LikeCount>{isLiked ? "❤️" : "🤍"}</LikeCount>
                            </PriceContainer>
                        </Card>
                    );
                })}
            </ItemContainer>

            <PagePagination
                totalItems={items.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                Text={"상품 추가"}
                navigate={onNavigate}
            />
        </ListWrap>
    );
}

export default ItemWrapper;