import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchData} from "../../Server/ApiServiceNoToken";
import ErrorPage from "../ErrorPage";
import {DetailContainer} from "../../styled/Container";
import {ItemInfo} from "../../styled/shopStyled";
import {DetailForm} from "../../styled/Form";
import {postTokenData} from "../../Server/ApiService";
import {useSelector} from "react-redux";

function ShopDetail(){

    const [fetchItem,setFetchItem]=useState();
    const [itemCount,setItemCount] = useState(1);
    const navigate = useNavigate()
    const {id}= useParams();

    const token = useSelector((state)=>state.auth.token);

    useEffect(() => {
        fetchData(`shop/detail/${id}`,setFetchItem)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }, [id]);

    const cartItemSubmit = async (e) =>{
        e.preventDefault()
        const formData = new FormData();
        formData.append("cartCount", itemCount);
        formData.append("itemId",id)
        await postTokenData("mypage/cart/add",formData,token)
    }

    const increaseCount = () => {
        setItemCount((prevCount) => prevCount + 1);
    };

    // 수량 감소 함수
    const decreaseCount = () => {
        setItemCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1)); // 최소 수량을 1로 설정
    };

    const onDelete = async() =>{
        const formdata = new FormData;
        formdata.append("itemId", id);
        try{
            postTokenData("mypage/cart/delete",token)
                .then((res)=>console.log(res))
                .catch((err) => console.log(err));
        }catch(err){
            console.log(err)
        }
    }

    const onUpdate = () =>{
        navigate(`/shop/update/${id}`)
    }

    if(fetchItem){
        const imageData = fetchItem.imgurl;
        const imageUrlArray = imageData.split(',');
        return(
            <DetailContainer>
                <h1>상품 상세페이지</h1>

                <ItemInfo>
                    <div>
                        {imageUrlArray.map((image)=>{
                            return(
                                <img src={image} alt={"#"} key={image}/>
                            )
                        })}
                    </div>

                    <div>상품추가 폼
                        <DetailForm onSubmit={cartItemSubmit} action={"/shop/"} method={"POST"}>
                            <button type={"button"} onClick={decreaseCount}>-</button>
                            <input type="number" value={itemCount} readOnly/> {/* readOnly 속성으로 직접 입력 불가 */}
                            <button type={"button"} onClick={increaseCount}>+</button>
                            <input type={"submit"} value={"장바구니 담기"}/>
                            <div>
                                <button onClick={onDelete} type={"button"}>삭제하기</button>
                                <button onClick={onUpdate}>수정하기</button>
                            </div>
                        </DetailForm>
                    </div>
                </ItemInfo>

                <h1>{fetchItem.title}</h1>


            </DetailContainer>
        )
    }else{
        return(
            <ErrorPage/>
        )
    }
}

export default ShopDetail;