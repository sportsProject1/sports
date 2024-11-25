import React, { useState, useEffect } from 'react';
import {handleNextSlide, handlePrevSlide} from "../../Utils/MainItemSlide";
import {Banner, BannerContainer, BannerInfo, BannerWrapper, NavButton} from "../../styled/main/MainPageStyled";

import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpg';
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

function MainBanner() {
    const [bannerIndex, setBannerIndex] = useState(0);
    const banners = [
        {
            image: banner1,
            text: `<span class="small-text">운동 친구를 만나고,</span><br><span class="large-text">모두의 건강한 변화를</span>`
        },
        {
            image: banner2,
            text: `<span class="small-text">함께라서 더 즐거운,</span><br><span class="large-text">성장의 기쁨을</span>`
        },
        {
            image: banner3,
            text: `<span class="small-text">더 건강한 삶을,</span><br><span class="large-text">Movo와 함께 만들어가요</span>`
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
            <BannerInfo dangerouslySetInnerHTML={{ __html: banners[bannerIndex].text }} />

        </BannerContainer>
    );
}

export default MainBanner;
