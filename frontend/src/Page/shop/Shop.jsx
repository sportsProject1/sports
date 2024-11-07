import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchData} from "../../Server/ApiServiceNoToken";
import {ShopContainer} from "../../styled/shopStyled";
import SideMenu from "../../Components/SideMenu";
import ItemWrapper from "./ItemWrapper";

function Shop() {
    const [items, setItems] = useState([]);

    const navigate= useNavigate()

    useEffect(() => {
        fetchData("/shop/list",setItems);
    }, []);
    // const thumbnailUrl = item.imgurl.split(',')[0];
    console.log(items)

    return (
        <ShopContainer>
            <SideMenu/>
            <ItemWrapper items={items}/>
        </ShopContainer>
    );
}

export default Shop;
