import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BannerContainer = styled.div`
    width: 100%; // 컨테이너는 100% 너비를 유지
    height: 700px;
    display: flex;
    overflow: hidden; // 넘치는 부분 숨기기
    position: relative; // 슬라이드 버튼 등을 위한 포지셔닝
    z-index: -1;
`;
export const BannerWrapper = styled.div`
    display: flex;
    width: 300%;
    transform: translateX(${props => props.translateX}%);
    transition: transform 0.5s ease-in-out;
`;

// 배너 슬라이드
export const Banner = styled.div`
    flex: 0 0 100%; // 한 슬라이드가 100% 너비 차지
    height: 700px;
    background-image: url('https://via.placeholder.com/300');
    background-size: cover;
    background-position: center;
    transition: transform 0.5s ease-in-out; // 슬라이드 애니메이션
    position: relative; 
`;
export const BannerInfo = styled.div`
    width: 400px;
    height: 200px;
    background-color: mediumaquamarine;
    position: absolute;
    left: 10%;
    bottom:5%;
    
`
export const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 24px;
    ${props => (props.left ? 'left: 10px' : 'right: 10px')};
    z-index: 1;
`;

// 섹션 제목
export const SectionTitle = styled.h2`
  font-size: 24px;
  margin: 20px 0;
`;

export const SectionContainer = styled.div`
    width: 80%;
    margin: auto;
    overflow: hidden;
    position: relative;
`;

export const CardWrapper = styled.div`
    display: flex;
    transition: transform 0.5s ease-in-out;
    transform: translateX(${props => props.translateX}%);
    width: 200%; // 2 페이지 분량으로 설정
`;

export const Card = styled.div`
    width:25%;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 10px;
`;

export const Image = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
`;

export const ProductName = styled.div`
    font-size: 18px;
    font-weight: bold;
    padding: 10px 5px;
    height: 50px;
    overflow: hidden; // 텍스트가 길 때 잘림 처리
`;

export const Price = styled.div`
    font-size: 16px;
    color: #555;
    padding: 5px;
    height: 50px;
`;

export const Footer = styled.footer`
    width:100%;
    height: 150px;
    background-color: green;
`