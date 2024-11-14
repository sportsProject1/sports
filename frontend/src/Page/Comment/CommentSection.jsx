import React, { useState, useEffect } from "react";
import { fetchData } from "../../Server/ApiServiceNoToken";
import { postTokenJsonData, deleteTokenData, putTokenJsonData } from "../../Server/ApiService";
import styled from "styled-components";

const CommentSectionContainer = styled.div`
    margin-top: 20px;
`;

const CommentForm = styled.form`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const CommentInput = styled.textarea`
    margin-bottom: 10px;
    padding: 10px;
    resize: none;
    height: 100px;
`;

const CommentButton = styled.button`
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }
`;

const CommentList = styled.div`
    margin-top: 20px;
`;

const CommentItem = styled.div`
    margin-bottom: 15px;
    padding: 10px;
    background-color: #f1f1f1;
    border-radius: 5px;
`;

const ReplyItem = styled.div`
    margin-bottom: 10px;
    padding: 8px;
    background-color: #e0e0e0;
    border-radius: 5px;
    margin-left: 20px;
    font-size: 0.9rem;
`;

const ReplyForm = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`;

const LikeButton = styled.button`
    padding: 5px;
    background-color: #ff7043;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: #ff5722;
    }
`;

const CommentSection = ({ itemId, target }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [replies, setReplies] = useState({});
    const [repliesVisible, setRepliesVisible] = useState({});
    const [likes, setLikes] = useState({});  // 좋아요 상태 관리

    // 댓글 불러오기
    useEffect(() => {
        fetchData(`/comment/get/${target}/${itemId}`).then((response) => {
            const commentsData = response.data.commentItems || [];
            setComments(groupCommentsByParent(commentsData));

            // 댓글들의 좋아요 수 초기화
            const initialLikes = {};
            commentsData.forEach((comment) => {
                initialLikes[comment.id] = comment.likes; // 서버에서 받은 likes 수를 초기화
            });
            setLikes(initialLikes);

            setLoading(false);
        }).catch(error => {
            console.error("Error fetching comments:", error);
        });
    }, [itemId, target]);

    const groupCommentsByParent = (comments) => {
        const grouped = [];
        comments.forEach(comment => {
            if (comment.parentId === null) {
                const replies = comments.filter(reply => reply.parentId === comment.id);
                grouped.push({ ...comment, replies });
            }
        });
        return grouped;
    };

    // 댓글 작성
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        const commentData = { content: newComment };

        try {
            const response = await postTokenJsonData(`/comment/add/${target}/${itemId}`, commentData);

            if (response && response.data.commentItems) {
                const savedComment = response.data.commentItems[0];
                setNewComment("");
                setComments((prevComments) => [
                    ...prevComments,
                    { ...savedComment, replies: [] }
                ]);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    // 대댓글 작성
    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        const replyContent = replies[commentId];
        if (!replyContent || replyContent.trim() === "") return;

        const replyData = { content: replyContent };

        try {
            const response = await postTokenJsonData(`/comment/add/reply/${commentId}`, replyData);

            if (response && response.data.commentItems) {
                const savedReply = response.data.commentItems[0];
                setComments((prevComments) => prevComments.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, replies: [...(comment.replies || []), savedReply] }
                        : comment
                ));
                setReplies((prevReplies) => ({ ...prevReplies, [commentId]: "" }));
            }
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };

    // 대댓글 입력 상태 변경
    const handleReplyChange = (e, commentId) => {
        setReplies((prevReplies) => ({
            ...prevReplies,
            [commentId]: e.target.value,
        }));
    };

    // 답글 버튼 클릭 시 대댓글 입력 폼 토글
    const handleReplyClick = (commentId) => {
        setRepliesVisible((prevRepliesVisible) => ({
            ...prevRepliesVisible,
            [commentId]: !prevRepliesVisible[commentId],
        }));
    };

    // 댓글 삭제
    const handleCommentDelete = async (commentId) => {
        try {
            await deleteTokenData(`/comment/delete/${commentId}`);
            setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    // 댓글 수정
    const handleCommentUpdate = async (commentId, updatedContent) => {
        const commentData = { content: updatedContent };

        try {
            const response = await putTokenJsonData(`/comment/update/${commentId}`, commentData);

            if (response.data && response.data.message === '댓글 수정 성공') {
                setComments((prevComments) => prevComments.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, content: updatedContent }
                        : comment
                ));
            } else {
                console.error("댓글 수정 실패");
            }
        } catch (error) {
            console.error("댓글 수정 중 오류 발생:", error);
        }
    };

    // 좋아요 처리
    const handleLike = async (commentId) => {
        try {
            const response = await postTokenJsonData(`/comment/like/${commentId}`);

            if (response && response.data) {
                // 서버에서 최신 좋아요 수를 받아와서 상태에 반영
                const updatedLikes = response.data.likes;  // 서버 응답에서 최신 좋아요 수를 받음

                setLikes((prevLikes) => ({
                    ...prevLikes,
                    [commentId]: updatedLikes // 해당 댓글의 좋아요 수 업데이트
                }));
            }
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    return (
        <CommentSectionContainer>
            <CommentForm onSubmit={handleCommentSubmit}>
                <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성하세요"
                />
                <CommentButton type="submit">댓글 작성</CommentButton>
            </CommentForm>

            {loading ? (
                <p>댓글을 불러오는 중...</p>
            ) : (
                <CommentList>
                    {comments.length === 0 ? (
                        <p>댓글이 없습니다.</p>
                    ) : (
                        comments.map((comment) => (
                            <CommentItem key={comment.id}>
                                <strong>{comment.username || "익명"}</strong>
                                <p>{comment.content}</p>

                                {/* 좋아요 버튼 */}
                                <LikeButton onClick={() => handleLike(comment.id)}>
                                    좋아요 {likes[comment.id] || 0}
                                </LikeButton>

                                {/* 수정, 삭제 버튼 */}
                                <div>
                                    <CommentButton onClick={() => handleCommentUpdate(comment.id, prompt("새 댓글 내용 입력"))}>수정</CommentButton>
                                    <CommentButton onClick={() => handleCommentDelete(comment.id)}>삭제</CommentButton>
                                </div>

                                <CommentButton onClick={() => handleReplyClick(comment.id)}>
                                    {repliesVisible[comment.id] ? "답글 취소" : "답글 작성"}
                                </CommentButton>

                                {repliesVisible[comment.id] && (
                                    <ReplyForm onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                                        <CommentInput
                                            value={replies[comment.id] || ""}
                                            onChange={(e) => handleReplyChange(e, comment.id)}
                                            placeholder="대댓글을 작성하세요"
                                        />
                                        <CommentButton type="submit">대댓글 작성</CommentButton>
                                    </ReplyForm>
                                )}

                                {comment.replies && comment.replies.map((reply, index) => (
                                    <ReplyItem key={index}>
                                        <strong>{reply.username || "익명"}</strong>
                                        <p>{reply.content}</p>
                                    </ReplyItem>
                                ))}
                            </CommentItem>
                        ))
                    )}
                </CommentList>
            )}
        </CommentSectionContainer>
    );
};

export default CommentSection;
