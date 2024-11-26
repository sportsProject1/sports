import React, { useEffect, useState } from 'react';
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";
import { MainCard, MainCardImage, MainPrice, MainProductName, MainBrandName, CardWrapper, NavButton, SectionContainer} from "../../styled/main/MainPageStyled";
import { fetchData } from "../../Server/ApiServiceNoToken";
import {useNavigate} from "react-router-dom";

function MainBestItem() {
    const [pageIndex, setPageIndex] = useState(0);
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const totalPages = Math.ceil(products.length / 4);

    // 이미지 URL 처리 함수
    const getFirstImageUrl = (imgurl) => {
        const urls = imgurl.split(","); // 콤마로 나누기
        return urls[0].trim();
    };

    // 가격 콤마 처리 함수
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
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
            <CardWrapper $translateX={-pageIndex * 150 / totalPages}>
                {products.map((product, index) => (
                    <MainCard onClick={()=>navigate(`/shop/detail/${product.id}`)} key={`product-${product.id}-${index}`}>
                        <MainCardImage src={product.imgurl} alt={product.title} />
                        <MainProductName>{product.title}</MainProductName>
                        <MainPrice>{formatPrice(product.price)}원</MainPrice>
                        <MainBrandName>{product.nickname}</MainBrandName>
                    </MainCard>
                ))}
            </CardWrapper>
            <NavButton $left={true} onClick={() => setPageIndex(prevIndex => handlePrevSlide(prevIndex, totalPages))}>◀</NavButton>
            <NavButton onClick={() => setPageIndex(prevIndex => handleNextSlide(prevIndex, totalPages))}>▶</NavButton>
        </SectionContainer>
    );
}

export default MainBestItem;
