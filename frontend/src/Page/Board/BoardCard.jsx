import {Author, BoardPostImage, CategoryTag, PostCard, PostTitle} from "../../styled/main/MainPageStyled";
import {BoardWrapperImg, PostContent, PostInfo} from "../../styled/List/ListStyled";
import React from "react";
import {useNavigate} from "react-router-dom";

function BoardCardType({post,thumbnailUrl,timeAgo,isLiked,formattedDate}){
    const navigate = useNavigate()
    return(

        <PostCard onClick={() => navigate(`/board/detail/${post.id}`)}>
            <BoardPostImage>
                <BoardWrapperImg src={thumbnailUrl} alt={`thumbnail ${post.title}`} />
                <CategoryTag>{post.category}</CategoryTag>
            </BoardPostImage>
            <PostContent>
                <PostTitle>{post.title}</PostTitle>
                <Author>{post.author}</Author>
                <PostInfo>
                    <span className="time-ago">{timeAgo}</span>
                    <div className="details">
                        <span> 👀 {post.views}</span>
                        <span>{isLiked ? "❤️ " : "🤍 "}{post.likes}</span>
                    </div>
                </PostInfo>
                <div style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}>
                    {formattedDate}
                </div>
            </PostContent>
        </PostCard>
    )
}
export default BoardCardType