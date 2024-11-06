import styled from "styled-components";
import {
    Banner,
    BannerContainer, BannerInfo,
    BannerWrapper,
    MainContainer,
    NavButton, Price, ProductName, SectionContainer,
    SectionTitle, Image, CardWrapper, Card, Footer
} from "../styled/main/MainPageStyled";
import { Divider} from "../styled/Common";
import React, {useEffect, useState} from "react";

function Home() {
    const [bannerIndex, setBannerIndex] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);

    const banners = [
        'https://via.placeholder.com/1200x700?text=Banner+1',
        'https://via.placeholder.com/1200x700?text=Banner+2',
        'https://via.placeholder.com/1200x700?text=Banner+3',
    ];
    const products = [
        { id: 1, image: 'https://via.placeholder.com/300', name: '상품 1', price: '₩10,000' },
        { id: 2, image: 'https://via.placeholder.com/300', name: '상품 2', price: '₩20,000' },
        { id: 3, image: 'https://via.placeholder.com/300', name: '상품 3', price: '₩30,000' },
        { id: 4, image: 'https://via.placeholder.com/300', name: '상품 4', price: '₩40,000' },
        { id: 5, image: 'https://via.placeholder.com/300', name: '상품 5', price: '₩50,000' },
        { id: 6, image: 'https://via.placeholder.com/300', name: '상품 6', price: '₩60,000' },
        { id: 7, image: 'https://via.placeholder.com/300', name: '상품 7', price: '₩70,000' },
        { id: 8, image: 'https://via.placeholder.com/300', name: '상품 8', price: '₩80,000' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3000); // 3초마다 다음 슬라이드로 넘어감

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    }, [banners.length]);



    const handleNextSlide = () => {
        setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const handlePrevSlide = () => {
        setBannerIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const handleItemNextSlide = () => {
        setPageIndex((prevIndex) => (prevIndex + 1) % 2);
    };

    const handleItemPrevSlide = () => {
        setPageIndex((prevIndex) => (prevIndex - 1 + 2) % 2);
    };

    return (
        <MainContainer>

            <BannerContainer>
                <BannerWrapper translateX={-bannerIndex * 100}>
                    {banners.map((url, idx) => (
                        <Banner key={idx} style={{ backgroundImage: `url(${url})` }}>
                            <BannerInfo>소개문구</BannerInfo>
                        </Banner>
                    ))}
                </BannerWrapper>
                <NavButton left onClick={handlePrevSlide}>◀</NavButton>
                <NavButton onClick={handleNextSlide}>▶</NavButton>
            </BannerContainer>

            <Divider/>

            <SectionTitle>최신 게시글</SectionTitle>
            <SectionContainer>
                <CardWrapper translateX={-pageIndex * 50}>
                    {products.map(product => (
                        <Card key={product.id}>
                            <Image src={product.image} alt={product.name} />
                            <ProductName>{product.name}</ProductName>
                            <Price>{product.price}</Price>
                        </Card>
                    ))}
                </CardWrapper>
                <NavButton left onClick={handleItemPrevSlide}>◀</NavButton>
                <NavButton onClick={handleItemNextSlide}>▶</NavButton>
            </SectionContainer>

            <Divider/>

            <SectionTitle>최신 게시글</SectionTitle>
            <SectionContainer>
                <CardWrapper translateX={-pageIndex * 50}>
                    {products.map(product => (
                        <Card key={product.id}>
                            <Image src={product.image} alt={product.name} />
                            <ProductName>{product.name}</ProductName>
                            <Price>{product.price}</Price>
                        </Card>
                    ))}
                </CardWrapper>
                <NavButton left onClick={handleItemPrevSlide}>◀</NavButton>
                <NavButton onClick={handleItemNextSlide}>▶</NavButton>
            </SectionContainer>

            <Footer/>

        </MainContainer>
    )
}

export default Home;