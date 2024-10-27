import { useEffect, useState } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {fetchData} from "../../Server/ApiServiceNoToken";
import {ShopCard, ShopContainer, ShopList} from "../../styled/shopStyled";

function Shop() {
    const [items, setItems] = useState([]);

    const navigate= useNavigate()

    useEffect(() => {
        fetchData("shop/list",setItems)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }, []);
    // const thumbnailUrl = item.imgurl.split(',')[0];

    return (
        <ShopContainer>
            <Link to={"/shop/add"}>상품 추가하기</Link>

            <ShopList>
                {items.map((item)=>{
                    const thumbnailUrl = item.imgurl.split(',')[0];
                    return(
                        <ShopCard key={item.id} onClick={()=>navigate(`/shop/detail/${item.id}`)}>
                            <img src={thumbnailUrl} alt={"#"}/>
                            <p>{item.title}</p>
                            <p>{item.price}</p>
                        </ShopCard>
                    )
                })}
            </ShopList>

        </ShopContainer>
    );
}

export default Shop;
