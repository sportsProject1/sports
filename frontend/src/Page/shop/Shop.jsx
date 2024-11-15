import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchData} from "../../Server/ApiServiceNoToken";
import {ShopContainer} from "../../styled/shopStyled";
import SideMenu from "../../Components/Menu/SideMenu";
import ItemWrapper from "./ItemWrapper";
import LoadingPage from "../../Components/LoadingPage";

function Shop() {
    const [items, setItems] = useState([]);

    const navigate= useNavigate()

    useEffect(() => {
        fetchData("/shop/list").then((res)=>{
            console.log(res)
            setItems(res.data.items)
        });
    }, []);
    // const thumbnailUrl = item.imgurl.split(',')[0];
    if(items){
        return (
            <ShopContainer>
                <SideMenu/>
                <ItemWrapper items={items}/>
            </ShopContainer>
        );
    }else{
        return (
            <LoadingPage/>
        )
    }

}

export default Shop;
