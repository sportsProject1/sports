import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 전체 사이드바 컨테이너
export const SidebarContainer = styled.div`
    width: 350px;
`;

export const SidebarFixed = styled.div`
    width: 300px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.surface};
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: fixed;
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
    transform: ${({ scrollDirection }) => (scrollDirection === 'up' ? 'translateY(0)' : 'translateY(10px)')};
    opacity: ${({ scrollDirection }) => (scrollDirection === 'up' ? 1 : 0.9)};
`;

// 제목 스타일
export const SectionTitle = styled.h2`
    font-size: 18px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.text};
`;

// 각 섹션 컨테이너
export const CategorySection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

// 라벨 스타일 (필요시 사용)
export const Label = styled.span`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
`;

// 키워드 스타일 (필요시 사용)
export const KeywordTag = styled.div`
    display: inline-block;
    background-color: #f1f1f1;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
    color: #555;
    margin-right: 5px;
`;

function SideMenu() {
    const [scrollDirection, setScrollDirection] = useState('up');
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <SidebarContainer>
            <SidebarFixed scrollDirection={scrollDirection}>
                <CategorySection>
                    <SectionTitle>Keywords</SectionTitle>
                    <div>
                        <KeywordTag>Spring</KeywordTag>
                        <KeywordTag>Smart</KeywordTag>
                        <KeywordTag>Modern</KeywordTag>
                    </div>
                </CategorySection>

                <CategorySection>
                    <SectionTitle>Category 1</SectionTitle>
                    <Label>Label Description</Label>
                    <Label>Label Description</Label>
                    <Label>Label Description</Label>
                </CategorySection>

                <CategorySection>
                    <SectionTitle>Category 2</SectionTitle>
                    <Label>Label Description</Label>
                    <Label>Label Description</Label>
                    <Label>Label Description</Label>
                </CategorySection>

                <CategorySection>
                    <SectionTitle>Color</SectionTitle>
                    <Label>Label</Label>
                    <Label>Label</Label>
                    <Label>Label</Label>
                </CategorySection>

                <CategorySection>
                    <SectionTitle>Size</SectionTitle>
                    <Label>Label</Label>
                    <Label>Label</Label>
                    <Label>Label</Label>
                </CategorySection>
            </SidebarFixed>
        </SidebarContainer>
    );
}

export default SideMenu;
