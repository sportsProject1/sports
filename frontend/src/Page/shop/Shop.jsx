import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function Shop(){

    const [items, setItems] = useState([]);

    useEffect(() => {
        const getItems = async () => {
            try {
                const response = await axios.get("http://localhost:8090/shop/list");
                console.log(response)
                setItems(response.data);
            }catch (error) {
                console.log(error)
            }
        }
        getItems()
    }, []);

    console.log(items)

    return(
        <div>
            <h1>상점페이지</h1>

            <Link to={"/shop/add"}>상품 추가</Link>
            
        </div>
    )
}

export default Shop;