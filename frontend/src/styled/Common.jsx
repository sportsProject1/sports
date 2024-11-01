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
