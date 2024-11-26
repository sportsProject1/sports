import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import LoadingPage from "../LoadingPage";

// 전체 사이드바 컨테이너
export const SidebarContainer = styled.div`
    width: 17%;
`;

// `scrollDirection` prop을 DOM에 전달되지 않도록 설정
export const SidebarFixed = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'scrollDirection'
})`
    width: 250px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.surface};
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: fixed;
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
`;

// 제목 스타일
export const SectionTitle = styled.h2`
    font-size: 18px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.primary};
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

function SideMenu({ category, params,categoryTitle,subCategoryTitle,subCategory,handleViewAll }) {

    // Memoize category links to prevent unnecessary re-renders
    const categoryLinks = useMemo(() => {

        return category?.map((item) => {
            return (
                <Link key={item.id} to={`${params}/${item.enName}`}>{item.name}</Link>
            );
        });
    }, [category, params]);
    const subCategoryLinks = useMemo(() => {
        return subCategory?.map((item) => (
            <Link key={item.id} to={`${params}/${item.enName}`}>{item.name}</Link>
        ));
    }, [category, params]);

    if (category) {
        return (
            <SidebarContainer>
                <SidebarFixed>
                    <CategorySection>
                        <SectionTitle>{categoryTitle}</SectionTitle>
                        <Link onClick={handleViewAll} to={params}>모두 보기</Link>
                        {categoryLinks}
                    </CategorySection>

                    <CategorySection>
                        <SectionTitle>{subCategoryTitle}</SectionTitle>
                        {subCategoryLinks}
                    </CategorySection>
                </SidebarFixed>
            </SidebarContainer>
        );
    } else {
        return <LoadingPage />;
    }
}

export default SideMenu;
