import {ListWrap} from "../../styled/List/ListStyled";
import SubMenu from "../../Components/Menu/SubMenu";
import {ItemContainer} from "../../styled/Common";

function NoItemBoardWrapper({handleSortChange, text}){
    return(
        <ListWrap>
            <SubMenu handleSortChange={handleSortChange}/>
            <ItemContainer style={{height: '286px'}}>
                {text} 존재하지 않습니다.
            </ItemContainer>
        </ListWrap>
    )
}
export default NoItemBoardWrapper