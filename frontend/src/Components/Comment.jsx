import {
    CommentAuthor, CommentContent,
    CommentHeader,
    CommentInput,
    CommentItem, CommentLikeButton,
    CommentListContainer,
    CommentSection, CommentTime, EditCommentInput, KebabMenuButton, MenuContainer, MenuItemButton,
    SubmitButton
} from "../styled/CommentStyled";
import {useState} from "react";
import {deleteTokenData, putTokenJsonData} from "../Server/ApiService";

function Comment({commentData,comment,setComment,onCreateComment,setCommentData}){
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);

    const [editIndex, setEditIndex] = useState(null);
    const [editContent, setEditContent] = useState("");

    const toggleMenu = (index) => {
        if (activeMenuIndex === index) {
            setActiveMenuIndex(null);
        } else {
            setActiveMenuIndex(index);
        }
    };

    const handleEditComment = (index, content) => {
        setEditIndex(index);
        setEditContent(content);
        setActiveMenuIndex(null)
    };

    const handleDeleteComment = async (commentId) => {
        setActiveMenuIndex(null)
        console.log(`삭제하기 클릭됨 - 댓글 ID: ${commentId}`);
        try {
            await deleteTokenData(`/comment/delete/${commentId}`);
            setCommentData((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        } catch (e) {
            console.log(e);
        }
    };

    const handleEditSubmit = async (commentId) => {
        console.log(`수정 완료 - 댓글 ID: ${commentId}, 수정 내용: ${editContent}`);
        const updateComment = {
            content: editContent
        };

        try {
            await putTokenJsonData(`/comment/update/${commentId}`, updateComment);
            setCommentData((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId ? { ...comment, content: editContent } : comment
                )
            );
        } catch (e) {
            console.log(e);
        }
        setEditIndex(null);
    };
    return(
        <CommentSection>
            <CommentInput
                placeholder="댓글을 작성하세요..."
                value={comment}
                onChange={(e) => {
                    setComment(e.target.value);
                }}
            />
            <SubmitButton onClick={onCreateComment}>댓글 작성</SubmitButton>

            <CommentListContainer>
                {commentData?.map((comment, index) => (
                    <CommentItem key={index}>
                        <CommentHeader>
                            <CommentAuthor>{comment.username}</CommentAuthor>
                            <div className="comment-actions">
                                <CommentLikeButton onClick={() => {/* 좋아요 토글 로직 추가 */}}>좋아요</CommentLikeButton>
                                <CommentTime>{comment.createdAt}</CommentTime>
                                <KebabMenuButton onClick={() => toggleMenu(index)}>⋮</KebabMenuButton>
                                {activeMenuIndex === index && (
                                    <MenuContainer>
                                        <MenuItemButton onClick={() => handleEditComment(index, comment.content)}>수정하기</MenuItemButton>
                                        <MenuItemButton onClick={() => handleDeleteComment(comment.id)}>삭제하기</MenuItemButton>
                                    </MenuContainer>
                                )}
                            </div>
                        </CommentHeader>
                        {editIndex === index ? (
                            <EditCommentInput
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        ) : (
                            <CommentContent>{comment.content}</CommentContent>
                        )}
                        {editIndex === index && (
                            <>
                                <SubmitButton onClick={() => handleEditSubmit(comment.id)}>수정 완료</SubmitButton>
                                <SubmitButton onClick={() => setEditIndex(null)}>수정 취소</SubmitButton>
                            </>

                        )}
                    </CommentItem>
                ))}
            </CommentListContainer>
        </CommentSection>
    )
}
export default Comment