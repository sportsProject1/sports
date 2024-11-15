// 스타일 정의
import styled from "styled-components";

export const CommentListContainer = styled.div`
    margin-top: 20px;
    border-top: 1px solid #ddd;
`;

export const CommentItem = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
`;

export const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
`;

export const CommentAuthor = styled.span`
    font-weight: bold;
    color: #333;
`;

export const CommentTime = styled.span`
    font-size: 0.9rem;
    color: #999;
`;

export const CommentContent = styled.p`
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
`;