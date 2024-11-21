import React from "react";
import styled from "styled-components";

// Styled Components
const AdvertisementContainer = styled.div`
    width: 14%;
    min-width: 200px;
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 15px;
    height: auto;
    position: absolute;
    left: 30px;
    top: 260px;
    text-align: center;
`;

const Title = styled.h3`
    font-size: 18px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
`;

const HighlightText = styled.span`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
`;

const Paragraph = styled.p`
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 15px;
`;

const Email = styled.p`
    font-size: 14px;
    font-weight: lighter;
    color: ${({ theme }) => theme.colors.secondary};
    margin-top: 10px;
    line-height:1.5rem;
`;

function Advertisement() {
    return (
        <AdvertisementContainer>
            <Title>WE ARE HIRING</Title>
            <Paragraph>
                Movo는 운동을 사랑하는<br/>사람들이 모이는 공간입니다. <br />
                Movo에 <HighlightText>입점하여 </HighlightText>함께 성장할<br/> 열정적인 판매자를 모십니다.
            </Paragraph>
            <Paragraph>
                아래 이메일로 지원하시면<br/> 검토후 양식을 보내드립니다.
            </Paragraph>
            <Email>입점지원 문의<br/> apply@movocommunity.com</Email>
        </AdvertisementContainer>
    );
}

export default Advertisement;
