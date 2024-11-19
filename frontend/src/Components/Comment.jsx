import {
    CommentAuthor, CommentContent,
    CommentHeader,
    CommentInput,
    CommentItem, CommentLikeButton,
    CommentListContainer,
    CommentSection, CommentTime, EditCommentInput, KebabMenuButton, MenuContainer, MenuItemButton,
    SubmitButton
} from "../styled/CommentStyled";
import { useState } from "react";
import {deleteTokenData, postTokenJsonData, putTokenJsonData} from "../Server/ApiService";
import { useSelector } from "react-redux"; // 사용자 정보를 가져오기 위해 추가

function Comment({ commentData, comment, setComment, onCreateComment, setCommentData, postAuthorId,boardId }) {
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editContent, setEditContent] = useState("");

    // 현재 로그인한 사용자 ID 가져오기 (Redux 사용 예시)
    const currentUserId = useSelector((state) => state.auth?.userId);

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
        setActiveMenuIndex(null);
    };

    const handleDeleteComment = async (commentId) => {
        setActiveMenuIndex(null);
        try {
            await deleteTokenData(`/comment/delete/${commentId}`);
            setCommentData((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        } catch (e) {
            console.log(e);
        }
    };

    const handleEditSubmit = async (commentId) => {
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
    const onInvite = async (userId) =>{
        console.log(userId)
        const inviteUser = {
            userId : userId
        }
        postTokenJsonData(`/chat/invite/36`,inviteUser).then((res)=>{
            console.log(res)

        })
    }

    return (
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
                                <CommentLikeButton onClick={() => {/* 좋아요 토글 로직 추가 */ }}>좋아요</CommentLikeButton>
                                <CommentTime>{comment.createdAt}</CommentTime>
                                {/* 케밥 메뉴 버튼 조건부 렌더링 */}
                                {(comment.userId === currentUserId || currentUserId === postAuthorId) && (
                                    <KebabMenuButton onClick={() => toggleMenu(index)}>⋮</KebabMenuButton>
                                )}
                                {activeMenuIndex === index && (
                                    <MenuContainer>
                                        {/* 댓글 작성자이거나 게시글 작성자가 본인의 댓글을 작성한 경우 */}
                                        {comment.userId === currentUserId && (
                                            <>
                                                <MenuItemButton onClick={() => handleEditComment(index, comment.content)}>수정하기</MenuItemButton>
                                                <MenuItemButton onClick={() => handleDeleteComment(comment.id)}>삭제하기</MenuItemButton>
                                            </>
                                        )}
                                        {/* 게시글 작성자이지만 다른 사용자가 작성한 댓글일 경우 */}
                                        {currentUserId === postAuthorId && comment.userId !== currentUserId && (
                                            <>
                                                <MenuItemButton onClick={() => handleDeleteComment(comment.id)}>삭제하기</MenuItemButton>
                                                <MenuItemButton onClick={() => onInvite(comment.userId)}>초대하기</MenuItemButton>
                                            </>
                                        )}
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
    );
}

export default Comment;
