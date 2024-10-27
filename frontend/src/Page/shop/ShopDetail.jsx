import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchData} from "../../Server/ApiServiceNoToken";
import ErrorPage from "../ErrorPage";

function ShopDetail(){

    const [fetchItem,setFetchItem]=useState();
    const {id}= useParams();

    useEffect(() => {
        fetchData(`shop/detail/${id}`,setFetchItem)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }, []);

    if(fetchItem){
        const imageData = fetchItem.imgurl;
        const imageUrlArray = imageData.split(',');
        console.log(imageUrlArray);
        return(
            <div>상세페이지
                <h1>{fetchItem.title}</h1>
                {imageUrlArray.map((image)=>{
                    return(
                        <img src={image} alt={"#"}/>
                    )
                })}

            </div>
        )
    }else{
        return(
            <ErrorPage/>
        )
    }
}

export default ShopDetail;