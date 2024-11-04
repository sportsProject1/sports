import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 1200px;
  padding: 20px;
`;

// 배너
export const Banner = styled.div`
  width: 100%;
  height: 300px; // 배너 높이
  background-image: url('https://via.placeholder.com/300'); // 배너 이미지
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 20px;
`;

// 섹션 제목
export const SectionTitle = styled.h2`
  font-size: 24px;
  margin: 20px 0;
`;
