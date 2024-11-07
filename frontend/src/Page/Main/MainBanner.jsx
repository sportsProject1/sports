import React, { useState, useEffect } from 'react';
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";
import {Banner, BannerContainer, BannerInfo, BannerWrapper, NavButton} from "../../styled/main/MainPageStyled";

function MainBanner() {
    const [bannerIndex, setBannerIndex] = useState(0);
    const banners = [
        'https://via.placeholder.com/1200x700?text=Banner+1',
        'https://via.placeholder.com/1200x700?text=Banner+2',
        'https://via.placeholder.com/1200x700?text=Banner+3',
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex(prevIndex => handleNextSlide(prevIndex, banners.length));
        }, 3000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const handlePrev = () => {
        setBannerIndex(prevIndex => handlePrevSlide(prevIndex, banners.length));
    };

    const handleNext = () => {
        setBannerIndex(prevIndex => handleNextSlide(prevIndex, banners.length));
    };
    return (
        <BannerContainer>
            <BannerWrapper $translateX={-bannerIndex * 100}>
                {banners.map((url, idx) => (
                    <Banner key={idx} style={{ backgroundImage: `url(${url})` }}>
                        <BannerInfo>소개문구</BannerInfo>
                    </Banner>
                ))}
            </BannerWrapper>
            <NavButton $left={true} onClick={handlePrev}>◀</NavButton>
            <NavButton onClick={handleNext}>▶</NavButton>
        </BannerContainer>
    );
}

export default MainBanner;
