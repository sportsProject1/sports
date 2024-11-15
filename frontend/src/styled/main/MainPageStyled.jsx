import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BannerContainer = styled.div`
    width: 100%;
    height: 700px;
    display: flex;
    overflow: hidden;
    position: relative;
    background-color: #000;
`;

export const Banner = styled.div`
    flex: 0 0 100%;
    height: 700px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 0.5s ease, filter 0.5s ease;

    &:hover {
        filter: brightness(0.8);
        transform: scale(1.1);
    }
`;

export const BannerWrapper = styled.div`
    display: flex;
    width: 300%;
    transform: translateX(${(props) => props.$translateX}%);
    transition: transform 1s ease-in-out;
`;

export const BannerInfo = styled.div`
    width: max-content;
    position: absolute;
    bottom: 5%;
    left: 5%;
    text-align: left;
    z-index: 10;

    .small-text {
        color: rgba(255, 255, 255, 0.8);
        font-size: 3.5rem;
        font-weight: 500;
    }

    .large-text {
        color: white;
        font-size: 5rem;
        font-weight: bold;
    }

    line-height: 1.6;
    white-space: pre-line;
    transform: text-shadow 1s ease;
    line-height: 1.15;

    ${BannerContainer}:hover & {
    text-shadow:
        -2px -2px 2px rgba(0, 0, 0, 0.3),
        2px -2px 2px rgba(0, 0, 0, 0.3),
        -2px 2px 2px rgba(0, 0, 0, 0.3),
        2px 2px 2px rgba(0, 0, 0, 0.3);
    }
`;

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
    ${({ $left }) => ($left ? 'left: 10px' : 'right: 10px')};
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
    transform: translateX(${props => props.$translateX}%);
    width: 200%; // 2 페이지 분량으로 설정
`;

export const PostCard = styled.div`
    width: 25%;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    border: 1px solid #e0e0e0;
    position: relative;
    margin: 10px;
    cursor: pointer;
`;

// 카테고리 태그 스타일
export const CategoryTag = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #f1f3f5;
    color: #495057;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 12px;
`;

// 이미지 스타일
export const PostImage = styled.div`
    width: 100%;
    height: 180px;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

// 기본 이미지 (없을 경우 보여줄 이미지)
export const PlaceholderImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
`;

// 콘텐츠 영역 스타일
export const PostContent = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

// 제목 스타일
export const PostTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    color: #212529;
    margin: 0;
`;

// 작성자 스타일
export const Author = styled.div`
    font-size: 14px;
    color: #868e96;
`;

// 날짜와 조회수 스타일
export const PostInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #868e96;
`;