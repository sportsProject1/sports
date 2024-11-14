import React, { useState, useEffect } from 'react';
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";
import {Banner, BannerContainer, BannerInfo, BannerWrapper, NavButton} from "../../styled/main/MainPageStyled";

import banner1 from '../../assets/banner4.webp';
import banner2 from '../../assets/banner2.webp';
import banner3 from '../../assets/banner6.webp';

function MainBanner() {
    const [bannerIndex, setBannerIndex] = useState(0);
    const banners = [banner1, banner2, banner3];


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
