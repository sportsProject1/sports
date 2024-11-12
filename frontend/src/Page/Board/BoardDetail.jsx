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
import {useParams} from "react-router-dom";

function BoardDetail(){
    const [detailBoard,setDetailBoard] = useState(null);
    const {id} = useParams()
    useEffect(() => {
        fetchData(`/board/${id}`).then((res)=>{
            setDetailBoard(res.data);
        })
    }, []);
    console.log(detailBoard);
    if(detailBoard === null){
        return(
            <div>로딩중</div>
        )
    }else{
        return(
            <PageContainer>
                {/*/!* 제목 및 작성 날짜 *!/*/}
                {/*<TitleSection>*/}
                {/*    <Title>{detailBoard.title}</Title>*/}
                {/*    <DateText>작성자:  | 작성일: </DateText>*/}
                {/*</TitleSection>*/}

                {/*/!* 이미지 슬라이드 *!/*/}
                {/*{detailBoard.images.map((image, index) => (*/}
                {/*    <SlideImage key={index} src={image} alt={`게시글 이미지 ${index + 1}`} />*/}
                {/*))}*/}

                {/*/!* 본문 *!/*/}
                {/*<ContentSection>*/}
                {/*    {detailBoard.content}*/}
                {/*    <InteractionSection>*/}
                {/*        <LikeButton>좋아요 {detailBoard.likes}</LikeButton>*/}
                {/*        <ViewsText>조회수: {detailBoard.views}</ViewsText>*/}
                {/*    </InteractionSection>*/}
                {/*</ContentSection>*/}

                {/*/!* 댓글 섹션 *!/*/}
                {/*<CommentSection>*/}
                {/*    <CommentInput placeholder="댓글을 작성하세요..." />*/}
                {/*    <SubmitButton>댓글 작성</SubmitButton>*/}
                {/*</CommentSection>*/}
            </PageContainer>
        )
    }

}
export default BoardDetail;