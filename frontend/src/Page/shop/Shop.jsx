import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {fetchData} from "../../Server/ApiService";

function Shop() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchData("shop/list",setItems)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div>
            <h2>전체 상품 보기</h2>
            <Link to="/shop/add">상품 추가</Link>

            <div className="card">
                {items.map((item) => (
                    <div key={item.id}>
                        <img
                            src={item.imgurl}
                            alt="Item Image"
                            onError={(e) => (e.target.src = 'https://placehold.co/300')}
                            className="item-image"
                        />
                        <div>
                            <Link to={`/shop/detail/${item.id}`}>
                                <h4>{item.title}</h4>
                            </Link>
                            <p>{item.price} 원</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Shop;
