// styled/Common.js
import styled from 'styled-components';

// 기본적인 페이지 컨테이너 스타일
export const Container = styled.div`
    max-width: 400px;
    margin: 5% auto;
    padding: ${({ theme }) => theme.spacing.large};
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.boxShadow};
    border-radius: ${({ theme }) => theme.borderRadius};
`;

// 페이지 제목 스타일
export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: black;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

// 공통 버튼 스타일
export const Button = styled.button`
    width:100%;
    padding: ${({ theme }) => theme.spacing.medium};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.surface};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: bold;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: ${({ theme }) => theme.transition};
    &:hover {
        background-color: ${({ theme }) => theme.colors.secondary};
        box-shadow: ${({ theme }) => theme.boxShadow};
    }
`;

// 공통 인풋 스타일
export const Input = styled.input`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.small};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    margin-top: ${({ theme }) => theme.spacing.small};
    transition: ${({ theme }) => theme.transition};
    &:focus {
        border-color: ${({ theme }) => theme.colors.primary};
        outline: none;
        box-shadow: 0 0 4px ${({ theme }) => theme.colors.primary};
    }
`;

export const Divider = styled.div`
    width: 250px;
    height: 4px;
    margin: 50px auto;
    background-color: #cccccc;
    border-radius: 2px;
`;

export const ItemContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    justify-content: center; /* 아이템을 왼쪽 정렬 */
`;

// 카드 css

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
    cursor: pointer;
`;

export const CardImage = styled.img`
    width: 100%;
    height: 180px;
    object-fit: cover;
`;

export const ProductName = styled.div`
    font-size: 18px;
    font-weight: bold;
    padding: 10px 5px;
    height: 28px;
    overflow: hidden; // 텍스트가 길 때 잘림 처리
    margin-top: 10px;
`;

export const BrandName = styled.div`
    font-size: 12px;
    padding: 10px 5px;
    height: 20px;
    margin-bottom: 10px;
    color: #a0a0a0;
`;

export const Price = styled.div`
    font-size: 16px;
    color: #555;
    padding: 5px;
    height: 50px;
    flex: 1;
    text-align: center;
`;

export const PriceContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #555;
    padding: 5px 0;
    height: 40px;
    width: 100%;
    position: relative;
`;

export const LikeCount = styled.span`
    font-size: 14px;
    color: black;
    position: absolute;
    right: 15px;
    top: 40%;
    transform: translateY(-50%);
    white-space: nowrap;
    padding-right: 5px;
`;

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: center; /* 페이지네이션을 중앙에 정렬 */
    align-items: center;
    margin-top: 20px;
    position: relative;
    padding-bottom: 25px;
`;

// 글 생성 버튼 컨테이너 (절대 위치)
export const CreateButtonContainer = styled.div`
    position: absolute;
    right: 0;
`;

export const CreateButton = styled.button`
    background-color: #0C48C5;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-right: 25px;

    &:hover {
        background-color: royalblue;
    }
`;


// Footer
