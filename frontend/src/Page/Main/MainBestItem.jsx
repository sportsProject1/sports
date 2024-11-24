import React, { useEffect, useState } from 'react';
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";
import {CardWrapper, NavButton, SectionContainer} from "../../styled/main/MainPageStyled";
import {Card, CardImage, Price, ProductName} from "../../styled/Common";
import { fetchData } from "../../Server/ApiServiceNoToken";

function MainBestItem() {
    const [pageIndex, setPageIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const totalPages = Math.ceil(products.length / 4);

    const DEFAULT_IMAGE_URL = "https://via.placeholder.com/300"; // 변경필요

    // 이미지 URL 처리 함수
    const getFirstImageUrl = (imgurl) => {
        if (!imgurl) return DEFAULT_IMAGE_URL; // 이미지가 없으면 기본 경로 반환
        const urls = imgurl.split(","); // 콤마로 나누기
        return urls.length > 0 ? urls[0].trim() : DEFAULT_IMAGE_URL;
    };

    // 데이터 요청
    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetchData("/shop/list"); // API 호출
                const itemList = response.data.items; // items 배열 추출

                // 필요한 데이터만 추출
                const filteredData = itemList.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    imgurl: getFirstImageUrl(item.imgurl), // 첫 번째 URL만 추출
                    nickname: item.nickname
                }));
                setProducts(filteredData); // 상태에 저장
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        }

        fetchItems();
    }, []);

    return (
        <SectionContainer>
            <CardWrapper $translateX={-pageIndex * 100 / totalPages}>
                {products.map((product, index) => (
                    <Card key={`product-${product.id}-${index}`}>
                        <CardImage src={product.imgurl} alt={product.title} />
                        <ProductName>{product.title}</ProductName>
                        <Price>{product.price}</Price>
                        <p>판매자: {product.nickname}</p>
                    </Card>
                ))}
            </CardWrapper>
            <NavButton $left={true} onClick={() => setPageIndex(prevIndex => handlePrevSlide(prevIndex, totalPages))}>◀</NavButton>
            <NavButton onClick={() => setPageIndex(prevIndex => handleNextSlide(prevIndex, totalPages))}>▶</NavButton>
        </SectionContainer>
    );
}

export default MainBestItem;
