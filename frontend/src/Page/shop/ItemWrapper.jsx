import {ListWrap} from "../../styled/List/ListStyled";
import SubMenu from "../../Components/SubMenu";
import React, {useState} from "react";
import {Card, ItemContainer, Price, ProductName,CardImage} from "../../styled/Common";
import Pagination from "../../Components/Pagination";
import {useNavigate} from "react-router-dom";

function ItemWrapper({items}){
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const navigate = useNavigate();

    // 현재 페이지의 게시글 슬라이싱
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return(
        <ListWrap>
            <SubMenu/>
            <ItemContainer>
            {currentItems.map((item)=>(
                <Card key={item.id} onClick={()=>navigate(`/shop/detail/${item.id}`)}>
                    <CardImage src={item.imgurl} alt={item.name} />
                    <ProductName>{item.title}</ProductName>
                    <Price>{item.price}</Price>
                </Card>
            ))}
            </ItemContainer>

            <Pagination
                totalItems={items.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </ListWrap>
    )
}
export default ItemWrapper;