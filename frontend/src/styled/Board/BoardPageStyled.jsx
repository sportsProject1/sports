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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f0f0f0; /* 배경색 설정 */
`;

// 제목 및 작성날짜 영역
export const TitleSection = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 본문 섹션
export const ContentSection = styled.div`
  background-color: #ffc0cb; /* 임시로 설정된 색상 */
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  line-height: 1.6;
`;

// 좋아요 및 조회수 섹션
export const InteractionSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const LikeButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ff4757;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;

export const ViewsText = styled.span`
  font-size: 0.9rem;
  color: #555;
`;

// 댓글 섹션
export const CommentSection = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const CommentInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  resize: vertical;
`;

export const SubmitButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;
