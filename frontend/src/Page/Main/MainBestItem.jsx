import React, { useState } from 'react';
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";
import {CardWrapper, NavButton, SectionContainer} from "../../styled/main/MainPageStyled";
import {Card, CardImage, Price, ProductName} from "../../styled/Common";

function MainBestItem() {
    const [pageIndex, setPageIndex] = useState(0);
    const products = [
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        // 다른 상품들...
    ];
    const totalPages = Math.ceil(products.length / 4);
    return (
        <SectionContainer>
            <CardWrapper $translateX={-pageIndex * 100 / totalPages}>
                {products.map((product, index) => (
                    <Card key={`product-${product.id}-${index}`}>
                        <CardImage src={product.image} alt={product.name} />
                        <ProductName>{product.name}</ProductName>
                        <Price>{product.price}</Price>
                    </Card>
                ))}
            </CardWrapper>
            <NavButton $left={true} onClick={() => setPageIndex(prevIndex => handlePrevSlide(prevIndex, totalPages))}>◀</NavButton>
            <NavButton onClick={() => setPageIndex(prevIndex => handleNextSlide(prevIndex, totalPages))}>▶</NavButton>
        </SectionContainer>
    );
}

export default MainBestItem;
