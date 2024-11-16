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
    position: relative;
`;

export const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;

    .comment-actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }
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

export const CommentSection = styled.div`
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const CommentInput = styled.textarea`
    width: 100%;
    height: 100px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 1rem;
    resize: vertical;
`;

export const SubmitButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #1e90ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
`;

export const CommentLikeButton = styled.button`
    padding: 0.5rem;
    background: none;
    border: none;
    color: #1e90ff;
    cursor: pointer;
    font-size: 0.9rem;
`;

export const KebabMenuButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: black;
`;

export const MenuContainer = styled.div`
    position: absolute;
    background: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    right: 10px;
    z-index: 1;
`;

export const MenuItemButton = styled.button`
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
`;

export const EditCommentInput = styled.textarea`
    width: 100%;
    height: 80px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 1rem;
    resize: vertical;
`;
