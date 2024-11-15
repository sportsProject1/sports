import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";
import {fetchData} from "../../Server/ApiServiceNoToken";
import LoadingPage from "../LoadingPage";

// 전체 사이드바 컨테이너
export const SidebarContainer = styled.div`
    width: 350px;
`;

// `scrollDirection` prop을 DOM에 전달되지 않도록 설정
export const SidebarFixed = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'scrollDirection'
})`
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

    const [category,setCategory] = useState()

    useEffect(() => {
        fetchData('/category/get').then((res) => {
            setCategory(res.data);
        }).catch((e)=>{
            console.log(e)
        })

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

    if(category){
        return (
            <SidebarContainer>
                <SidebarFixed scrollDirection={scrollDirection}>

                    <CategorySection>
                        <SectionTitle>Category 1</SectionTitle>
                        <Link to={"/board"}>모두 보기</Link>
                        {/*{category.map((item)=>{*/}
                        {/*    return (*/}
                        {/*        <Link key={item.id} to={`${category}`}>{category}</Link>*/}
                        {/*    )*/}
                        {/*})}*/}


                        <Link to={"soccer"}>축구</Link>
                        <Link to={"basketball"}>농구</Link>
                    </CategorySection>

                    <CategorySection>
                        <SectionTitle>Category 1</SectionTitle>
                        <Label>Label Description</Label>
                        <Label>Label Description</Label>
                        <Label>Label Description</Label>
                    </CategorySection>

                </SidebarFixed>
            </SidebarContainer>
        );
    }else{
        return (
            <LoadingPage/>
        )
    }


}

export default SideMenu;
