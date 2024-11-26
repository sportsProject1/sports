import {
    ItemLeft, ItemRight,
    ListItem,
    PostAuthor,
    PostAuthorBox,
    PostCategoryTag, PostPostTitle,
    PostTime
} from "../../styled/main/MainPageStyled";
import React from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
`

function BoardListType({post,thumbnailUrl,timeAgo,isLiked,formattedDate}){
    const navigate = useNavigate()
    return(
        <Container>
            <ListItem onClick={() => navigate(`/board/detail/${post.id}`)}>
                <ItemLeft>
                    <img src={thumbnailUrl} alt={thumbnailUrl} style={{ width: '100%',objectFit: 'contain'}}/>
                </ItemLeft>
                <ItemRight>
                    <PostCategoryTag>{post.category}</PostCategoryTag>
                    <PostAuthorBox>
                        <PostAuthor>{post.author}</PostAuthor>
                        <PostTime>{timeAgo}</PostTime>
                    </PostAuthorBox>
                    <PostPostTitle>{post.title}</PostPostTitle>
                </ItemRight>
            </ListItem>
        </Container>
    )
}
export default BoardListType