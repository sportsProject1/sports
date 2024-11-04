import styled from "styled-components";
import useImageUploader from "../hooks/useImageUploader";
import {useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {Banner, MainContainer, SectionTitle} from "../styled/main/MainPageStyled";
import * as PropTypes from "prop-types";
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

    const {images,handleImageChange,handleRemoveImage} = useImageUploader(true)

    const userData = useSelector((state)=>state.auth.user) // 리덕스 툴킷에 저장한 유저정보 가져오기
    const token = useSelector((state)=> state.auth.token); // 리덕스 툴킷에 저자한 토큰값 가져오기

    const decoded = token ? jwtDecode(token) : null;

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