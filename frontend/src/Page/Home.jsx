import styled from "styled-components";
import {Banner, MainContainer, SectionTitle} from "../styled/main/MainPageStyled";
import {Card, PostList} from "../styled/Common";

const PostContainer = styled.div`
    width: 1200px;
    height: 800px;
    margin: 0 auto;
    >form{
        width: 100%;
        >input,textarea{
            width: 100%;
            padding: 25px;
        }
        >textarea{
            min-height: 500px;
            max-height: 500px;
            resize: none;
        }
        >select{
            padding: 15px 30px;
        }
    }
    
    

`
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