import styled from "styled-components";

export const BoardContainer = styled.div`
    width: 100%;
    padding:40px;
    box-sizing: border-box;
    display: flex;
`

// 상세페이지
// 전체 페이지 컨테이너
export const PageContainer = styled.div`
  width: 60%;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f0f0f0;
`;

// 제목 및 작성날짜 영역
export const TitleSection = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
`;

export const SideMenu = styled.h1`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
  text-align: left;
  font-weight: bold;
`;

export const DateText = styled.span`
  font-size: 0.9rem;
  color: #888;
`;

// 이미지 슬라이드 섹션
export const ImageSliderContainer = styled.div`
  width: 100%;
  height: 400px;
  background-color: #eaeaea;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SlideImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

export const BoardPostImage = styled.img`
    width: 100%;
    height: 180px;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

// 본문 섹션
export const ContentSection = styled.div`
  background-color: #F0F4FF;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  line-height: 1.6;
  min-height:400px;

  p{
    min-height:400px;
  }

  img {
    max-width: 300px;
    max-height: 300px;
    object-fit: scale-down;
  }

`;

// 좋아요 및 조회수 섹션
export const InteractionSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const LikeButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f54c5a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 10px;
`;

export const ViewsText = styled.span`
  font-size: 0.9rem;
  color: #555;
  margin-left: 10px;
`;
