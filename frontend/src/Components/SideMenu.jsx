import styled from 'styled-components';

// 전체 사이드바 컨테이너
export const SidebarContainer = styled.div`
    width: 300px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.surface};
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    return (
        <SidebarContainer>
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
        </SidebarContainer>
    );
}
export default SideMenu
