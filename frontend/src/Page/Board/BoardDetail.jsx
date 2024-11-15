import {useEffect, useState} from "react";
import {
    CommentInput,
    CommentSection,
    ContentSection,
    DateText, InteractionSection, LikeButton,
    PageContainer,
    SlideImage, SubmitButton,
    Title,
    TitleSection, ViewsText
} from "../../styled/Board/BoardPageStyled";
import {fetchData} from "../../Server/ApiServiceNoToken";
import {useNavigate, useParams} from "react-router-dom";
import {deleteTokenData, postTokenData, postTokenJsonData} from "../../Server/ApiService";
import {
    CommentAuthor,
    CommentContent,
    CommentHeader,
    CommentItem,
    CommentListContainer,
    CommentTime
} from "../../styled/Comment";

function BoardDetail(){
    const [detailBoard,setDetailBoard] = useState(null);
    const {id} = useParams()
    const navigate = useNavigate();

    const [comment,setComment] = useState('');
    const [commentData, setCommentData] = useState()

    useEffect(() => {
        fetchData(`/board/${id}`).then((res)=>{
            setDetailBoard(res.data);
        })
        fetchData(`/comment/get/board/${id}`).then((res)=>{
            setCommentData(res.data.commentItems)
        })
    }, []);
    console.log(commentData)
    const formattedDate = detailBoard?.createdAt.split('T')[0].substring(2);


    const onDelete = async () =>{
        try{
            await deleteTokenData(`/board/${id}`).then((res)=>{
                navigate('/board')
            })
        }catch(e){
            console.log(e)
        }
    }

    const onCreateComment = async () =>{
        const postComment = {
            content : comment,
        }
        try{
            await postTokenJsonData(`/comment/add/board/${id}`,postComment).then((res)=>{
                console.log(res,"댓긍성공")
            })
        }catch(e){
            console.log(e)
        }
    }


    if(detailBoard === null){
        return(
            <div>로딩중</div>
        )
    }else{
        return(
            <PageContainer>
                {/* 제목 및 작성 날짜 */}
                <TitleSection>
                    <Title>{detailBoard.title}</Title>
                    <DateText>작성자:{detailBoard.author}  | 작성일: {formattedDate} </DateText>
                </TitleSection>

                {/* 이미지 슬라이드 */}
                {detailBoard.imgUrl && detailBoard.imgUrl.split(',').map((image, index) => (
                    <SlideImage key={index} src={image.trim()} alt={`게시글 이미지 ${index + 1}`} />
                ))}

                {/* 본문 */}
                <ContentSection>
                    <div dangerouslySetInnerHTML={{ __html: detailBoard.content }}></div>
                    <InteractionSection>
                        <LikeButton>좋아요 {detailBoard.likes}</LikeButton>
                        <div>
                            <LikeButton
                            onClick={()=>navigate(`/board/update/${id}`)}>수정하기</LikeButton>
                            <LikeButton onClick={onDelete}>삭제하기</LikeButton>
                            <ViewsText>조회수: {detailBoard.views}</ViewsText>
                        </div>
                    </InteractionSection>
                </ContentSection>

                {/* 댓글 섹션 */}
                <CommentSection>
                    <CommentInput
                        placeholder="댓글을 작성하세요..."
                        value={comment}
                        onChange={(e)=>{

                            setComment(e.target.value);
                        }}
                    />
                    <SubmitButton onClick={onCreateComment}>댓글 작성</SubmitButton>
                </CommentSection>
                <CommentListContainer>
                    {commentData?.map((comment, index) => (
                        <CommentItem key={index}>
                            <CommentHeader>
                                <CommentAuthor>{comment.username}</CommentAuthor>
                                <CommentTime>{comment.createdAt}</CommentTime>
                            </CommentHeader>
                            <CommentContent>{comment.content}</CommentContent>
                        </CommentItem>
                    ))}
                </CommentListContainer>
            </PageContainer>
        )
    }

}
export default BoardDetail;