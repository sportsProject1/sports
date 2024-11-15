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
`;

export const Banner = styled.div`
    flex: 0 0 100%;
    height: 700px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: filter 0.5s ease-in-out;
    &:hover {
        filter: blur(5px);
        transform: scale(1.1);
    }
`;

export const BannerWrapper = styled.div`
    display: flex;
    width: 300%;
    transform: translateX(${(props) => props.$translateX}%);
    transition: transform 1s ease-in-out;

    /* BannerContainer hover 상태에서 배너 블러 처리 */
    ${BannerContainer}:hover ${Banner} {
        filter: blur(5px);
    }
`;

export const BannerInfo = styled.div`
    width: max-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(255, 255, 255, 0.7);
    padding: 20px 40px;
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    line-height: 1.4;
    z-index: 10;
    background-color: transparent;
    opacity: 1;
    transition:
        opacity 0.5s ease-in-out,
        transform 0.5s ease-in-out,
        background-color 0.5s ease-in-out,
        color 0.5s ease-in-out,
        box-shadow 0.5s ease-in-out;

    ${BannerContainer}:hover & {
        background-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        color: black;
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

// 이미지 아이콘 (없을 경우 보여줄 아이콘)
export const PlaceholderIcon = styled.div`
    font-size: 48px;
    color: #adb5bd;
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