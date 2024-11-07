// styled/Common.js
import styled from 'styled-components';

// 기본적인 페이지 컨테이너 스타일
export const Container = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.large};
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.boxShadow};
    border-radius: ${({ theme }) => theme.borderRadius};
`;

// 페이지 제목 스타일
export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

// 공통 버튼 스타일
export const Button = styled.button`
    width: 100%;
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

export const KakaoLogin = styled.button`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.medium};
    background-color: #FEE500;
    color:#000000;
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
export const GoogleLogin = styled.button`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.medium};
    background-color: #4285F4;
    color:#FFFFFF;
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

export const Divider = styled.div`
    width: 250px;
    height: 4px;
    margin: 30px auto;
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
