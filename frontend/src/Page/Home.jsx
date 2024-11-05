import styled from "styled-components";
import {Banner, MainContainer, SectionTitle} from "../styled/main/MainPageStyled";
import {Card, PostList} from "../styled/Common";

function Home() {

    return (
        <MainContainer>

            <Banner/>

            <SectionTitle>최신 게시글</SectionTitle>
            <PostList>
                <Card>게시글 1</Card>
                <Card>게시글 2</Card>
                <Card>게시글 3</Card>
            </PostList>
            <SectionTitle>인기 게시글</SectionTitle>
            <SectionTitle>최신 게시글</SectionTitle>
            <PostList>
                <Card>게시글 1</Card>
                <Card>게시글 2</Card>
                <Card>게시글 3</Card>
            </PostList>
            <SectionTitle>최신 게시글</SectionTitle>
            <PostList>
                <Card>게시글 1</Card>
                <Card>게시글 2</Card>
                <Card>게시글 3</Card>
            </PostList>
        </MainContainer>
    )
}

export default Home;