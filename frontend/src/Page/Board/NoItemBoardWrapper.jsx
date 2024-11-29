import {ListWrap} from "../../styled/List/ListStyled";
import SubMenu from "../../Components/Menu/SubMenu";
import {ItemContainer} from "../../styled/Common";
import PagePagination from "../../Components/Pagination/PagePagination";
import React from "react";
import {useNavigate} from "react-router-dom";

function NoItemBoardWrapper({handleSortChange, text}){
    const navigate = useNavigate();
    const onNavigate = () => {
        navigate("/board/add");
    };
    return(
        <ListWrap>
            <SubMenu handleSortChange={handleSortChange}/>
            <ItemContainer style={{height: '286px'}}>
                {text} 존재하지 않습니다.
            </ItemContainer>
            <PagePagination
                Text={"글 작성"}
                navigate={onNavigate}
            />
        </ListWrap>
    )
}
export default NoItemBoardWrapper