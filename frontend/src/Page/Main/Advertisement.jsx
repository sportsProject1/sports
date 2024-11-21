import React from "react";
import styled from "styled-components";

const AdvertisementContainer = styled.div`
    width: 14%;
    min-width: 200px;
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 10px;
    height: auto;
    position:absolute;
    left: 30px;
    top: 260px;
`;

function Advertisement() {
    return (
        <AdvertisementContainer>
            <h3>광고</h3>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>
            <div>여기에 광고 배너가 들어갑니다.</div>

        </AdvertisementContainer>
    );
}

export default Advertisement;