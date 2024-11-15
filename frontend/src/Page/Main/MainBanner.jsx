import React, { useState, useEffect } from 'react';
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";
import {Banner, BannerContainer, BannerInfo, BannerWrapper, NavButton} from "../../styled/main/MainPageStyled";

import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpg';

function MainBanner() {
    const [bannerIndex, setBannerIndex] = useState(0);
    const banners = [
        {
            image: banner1,
            text: "나만의 운동 메이트를 만나고, 더 나은 나를 만들어 보세요!"
        },
        {
            image: banner2,
            text: "함께 하는 힘, 혼자서는 느낄 수 없는 성취감을 경험하세요."
        },
        {
            image: banner3,
            text: "건강한 라이프스타일의 시작, Movo가 여러분과 함께합니다."
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex(prevIndex => handleNextSlide(prevIndex, banners.length));
        }, 10000);

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
                {banners.map((banner, idx) => (
                    <Banner key={idx} style={{ backgroundImage: `url(${banner.image})` }} />
                ))}
            </BannerWrapper>
            <BannerInfo>{banners[bannerIndex].text}</BannerInfo>
            <NavButton $left={true} onClick={handlePrev}>◀</NavButton>
            <NavButton onClick={handleNext}>▶</NavButton>
        </BannerContainer>
    );
}

export default MainBanner;
