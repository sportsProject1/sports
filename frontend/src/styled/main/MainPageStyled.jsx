import styled from "styled-components";

export const MainContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position:relative;
`;

export const BannerContainer = styled.div`
    width: 85%;
    height: 300px;
    display: flex;
    overflow: hidden;
    position: relative;
    background-color: #000;
    left: -8%;
    margin: 0 auto;
`;

export const Banner = styled.div`
    flex: 0 0 100%;
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 10;

    .small-text {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.5rem;
        font-weight: 500;
    }

    .large-text {
        color: white;
        font-size: 3rem;
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
    border-radius: 50%;
    padding: 5px 10px 10px 10px;
    cursor: pointer;
    font-size: 26px;
    ${({ $left }) => ($left ? 'left: 30px' : 'right: 30px')};
    z-index: 1;
`;

// 섹션 제목
export const SectionTitle = styled.h2`
  font-size: 24px;
  margin: 20px 0;
`;

export const SectionContainer = styled.div`
    width: 70%;
    margin: auto;
    overflow: hidden;
    position: relative;
`;

//// 리스트 추가
export const ListContainer = styled.div`
    width: 100%;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ListItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ddd;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f1f1f1;
        cursor: pointer;
    }
`;

export const ItemLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    .thumbnail {
        width: 50px;
        height: 50px;
        background-color: #e9ecef;
        border-radius: 8px;
        object-fit: cover;
    }

    .text {
        display: flex;
        flex-direction: column;

        .title {
            font-weight: bold;
            color: #333;
            font-size: 14px;
        }

        .author {
            font-size: 12px;
            color: #777;
        }
    }
`;

export const ItemRight = styled.div`
    font-size: 12px;
    color: #555;
    text-align: right;

    .date {
        margin-bottom: 5px;
    }

    .views {
        font-weight: bold;
    }
`;
//// 리스트 추가

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

// 보드 이미지 (없을 경우 보여줄 이미지)
export const BoardImg = styled.img`
    width: 10%;
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