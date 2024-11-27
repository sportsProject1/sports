import {
    CommentAuthor, CommentContent,
    CommentHeader,
    CommentInputBox,
    CommentInput,
    CommentItem, CommentLikeButton,
    CommentListContainer,
    CommentSection, CommentTime, EditCommentInput, KebabMenuButton, MenuContainer, MenuItemButton,
    SubmitButton
} from "../styled/CommentStyled";
import { useState } from "react";
import {deleteTokenData, postTokenJsonData, putTokenJsonData} from "../Server/ApiService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Comment({ commentData, comment, setComment, onCreateComment, setCommentData, postAuthorId,chatRoomId }) {
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editContent, setEditContent] = useState("");

    const currentUserId = useSelector((state) => state.auth.user?.userId);
    const navigate = useNavigate();

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
        postTokenJsonData(`/chat/invite/${chatRoomId}`,inviteUser).then((res)=>{
            console.log(res)

        })
    }

    const formatDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleCreateComment = () => {
        if (!currentUserId) {
            alert('로그인 후 작성할 수 있습니다.');
            navigate('/login');  // 로그인 페이지로 리디렉션
        } else {
            onCreateComment();
        }
    };

    return (
        <CommentSection>
            <CommentInputBox>
                <CommentInput
                    placeholder="댓글을 작성하세요..."
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                    }}
                />
                <SubmitButton onClick={handleCreateComment}>댓글 입력</SubmitButton>
            </CommentInputBox>

            <CommentListContainer>
                {commentData?.map((comment, index) => (
                    <CommentItem key={index}>
                        <CommentHeader>
                            <CommentAuthor>{comment.username}</CommentAuthor>
                            <div className="comment-actions">
                                <CommentTime>{formatDate(comment.createdAt)}</CommentTime>
                                {/* 게시글 작성자인 경우 모든 댓글에 케밥 메뉴 표시 */}
                                {/* 게시글 작성자가 아닌 경우 자신의 댓글에만 케밥 메뉴 표시 */}
                                {(postAuthorId === currentUserId || comment.userId === currentUserId) && (
                                    <KebabMenuButton onClick={() => toggleMenu(index)}>⋮</KebabMenuButton>
                                )}

                                {activeMenuIndex === index && (
                                    <MenuContainer>
                                        {/* 본인이 쓴 댓글 */}
                                        {comment.userId === currentUserId && (
                                            <>
                                                <MenuItemButton onClick={() => handleEditComment(index, comment.content)}>
                                                    수정하기
                                                </MenuItemButton>
                                                <MenuItemButton onClick={() => handleDeleteComment(comment.id)}>
                                                    삭제하기
                                                </MenuItemButton>
                                            </>
                                        )}

                                        {/* 게시글 작성자가 다른 사용자의 댓글에 접근한 경우 */}
                                        {postAuthorId === currentUserId && comment.userId !== currentUserId && (
                                            <>
                                                <MenuItemButton onClick={() => handleDeleteComment(comment.id)}>
                                                    삭제하기
                                                </MenuItemButton>
                                                {chatRoomId && (
                                                    <MenuItemButton onClick={() => onInvite(comment.userId)}>
                                                        초대하기
                                                    </MenuItemButton>
                                                )}
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
