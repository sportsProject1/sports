import styled from "styled-components";

export const MainContainer = styled.div`
    margin: 0 auto;
    padding: 0 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position:relative;
`;

export const BannerContainer = styled.div`
    width: 82.5%;
    height: 200px;
    display: flex;
    overflow: hidden;
    margin-top: 20px;
    align-self: flex-start;
    position: relative;
    left:0;
`;

export const Banner = styled.div`
    flex: 0 0 100%;
    background-size: 120%;
    background-repeat: no-repeat;
    background-position: center;
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
        font-size: 1.3rem;
        font-weight: 500;
    }

    .large-text {
        color: white;
        font-size: 2.6rem;
        font-weight: bold;
    }


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
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    font-size: 30px;
    line-height: 1;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    ${({ $left }) => ($left ? 'left: 30px' : 'right: 30px')};
    z-index: 1;
`;

// 섹션 제목
export const SectionTitle = styled.h2`
    font-size: 24px;
    margin: 10px 0;
`;

export const SectionContainer = styled.div`
    width: 67%;
    margin: auto;
    overflow: hidden;
    position: relative;
`;

export const PostSectionContainer = styled.div`
    width: 70%;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    position: relative;
`;

//// 리스트 추가
export const ListContainer = styled.div`
    width: 49%;
    height: 600px;
    margin-top: 20px;
    margin-right: 9px;
    padding: 20px;
    border-radius: 8px;
`;

export const TagTitleContainer = styled.div`
     height:12%;
     background-color:#E7EDF0;
     border-radius:15px;
     text-align: center;
     width:100%;
     display:flex;
     align-items:center;
     justify-content:flex-start;
     padding-left:5%;
     font-weight:bold;
     cursor:pointer;

     &:hover {
         color: ${(props) => props.theme.colors.primary};
     }
 `;

export const ListItem = styled.div`
    display: flex;
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
    width: 50px;
    position:relative;
    margin-right: 10px;

    img {
        display:block;
        width: 100%;
        height: 50px;
        background-color: rgba(0,0,0,0.05);
        border-radius: 8px;
        object-fit: cover;
    }

`;

export const ItemRight = styled.div`
    font-size: 12px;
    color: #555;
    position:relative;
    width: calc(100% - 50px);
`;

export const PostAuthorBox = styled.div`
    width: 100%;
    display:flex;
    margin-bottom: 5px;
`;

export const PostAuthor = styled.div`
    font-size: 14px;
    width: fit-content;
    margin-right: 5px;
    color: black;
`;

export const PostTime = styled.div`
    font-size: 14px;
    color: gray;
    font-weight: 600;
`;

export const PostPostTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    color: #212529;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80%;
    line-height:20px;
`;

export const PostCategoryTag = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #d3e1ee99;
    color: #495057;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
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

//// 리스트 추가

export const CardWrapper = styled.div`
    display: flex;
    transition: transform 0.5s ease-in-out;
    transform: translateX(${props => props.$translateX}%);
    width: calc(${props => props.totalPages * 100}%);
`;

export const MainCard = styled.div`
    flex: 0 0 calc(25% - 20px);
    margin: 10px;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
`;

export const MainCardImage = styled.img`
    width: 95%;
    height: 180px;
    object-fit: cover;
`;

export const MainProductName = styled.div`
    font-size: 19px;
    font-weight: bold;
    padding: 10px 5px;
    height: 28px;
    overflow: hidden; // 텍스트가 길 때 잘림 처리
    margin-top: 10px;
`;

export const MainPrice = styled.div`
    font-size: 16px;
    color: #555;
    padding: 5px;
    height: 50px;
    flex: 1;
    text-align: center;
    margin-top: 10px;
    color: gray;
`;

export const MainBrandName = styled.div`
    font-size: 0.9rem;
`;

export const PostCardWrapper = styled.div`
    display: flex;
    flex-direction:column;
    gap: 20px;
    transition: transform 0.5s ease-in-out;
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

export const BoardPostImage = styled.div`
    width: 100%;
    height: 180px;
    overflow:hidden;
    background-color: #e9ecef;
    background-size: contain;
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    font-weight: bold;
    color: #212529;
    margin: 0;
    line-height:1.8rem;
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