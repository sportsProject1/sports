import {ListWrap} from "../../styled/List/ListStyled";
import SubMenu from "../../Components/Menu/SubMenu";
import {ItemContainer} from "../../styled/Common";

function NoItemBoardWrapper({handleSortChange}){
    return(
        <ListWrap>
            <SubMenu handleSortChange={handleSortChange}/>
            <ItemContainer>
                게시글이 존재하지 않습니다.
            </ItemContainer>
        </ListWrap>
    )
}
export default NoItemBoardWrapper