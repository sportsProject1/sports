import {useEffect, useState} from "react";
import {deleteTokenData, fetchTokenData, putTokenData, putTokenJsonData} from "../../Server/ApiService";
import {useSelector} from "react-redux";
import {
    CartContainer,
    CartItem, CartSummary,
    Checkbox, CheckoutButton, DeleteButton,
    ItemActions,
    ItemImage,
    ItemName,
    ItemPrice, QuantityInput, TotalPrice
} from "../../styled/Shop/ShopStyled";
import {ItemInfo} from "../../styled/shopStyled";

function ShopCart(){
    const [userCart,setUserCart] = useState([])

    const handleUpdate = async (type, itemId, cartId, value) => {
        // 최소 수량 제한 조건 추가 (type이 count일 경우)
        if (type === 'count' && value < 1) return;

        // 요청 페이로드 구성
        const payload = {
            cartId: cartId,
            [type]: value // count 또는 isChecked에 따라 다르게 설정
        };

        // 요청 경로 설정
        const endpoint = type === 'count'
            ? `/mypage/cart/update/count/${itemId}`
            : type === 'delete'
                ? `/mypage/cart/delete/${itemId}`
                : `/mypage/cart/update/checkbox/${itemId}`;
        try {
            if(type === 'delete'){
                await deleteTokenData(endpoint, payload);
                setUserCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
            }else{
                await putTokenJsonData(endpoint, payload);

                // 로컬 상태 업데이트
                setUserCart(prevCart =>
                    prevCart.map(item =>
                        item.cartId === cartId ? { ...item, [type]: value } : item
                    )
                );
            }

        } catch (error) {
            console.error(`Failed to update ${type}:`, error);
        }
    };


    useEffect(() => {
            fetchTokenData("/mypage/cart").then(
                (data)=>{
                    const itemsWithCount = data.data.map(cartItem => ({
                        ...cartItem.item,
                        count: cartItem.count,
                        cartId: cartItem.id,
                        isChecked: cartItem.checked,
                    }));
                    setUserCart(itemsWithCount);
                }
            )
    }, []);

    return (
        <CartContainer>
            {userCart.map(item => (
                <CartItem key={item.cartId}>
                    <Checkbox
                        onChange={()=>handleUpdate('isChecked', item.cartId, item.cartId, !item.isChecked)}
                        checked={item.isChecked} />
                    <ItemImage src={item.imgurl} alt={item.name} />
                    <ItemInfo>
                        <ItemName>{item.title}</ItemName>
                        <ItemPrice>{item.price.toLocaleString()}원</ItemPrice>
                    </ItemInfo>
                    <ItemActions>
                        <button onClick={() => handleUpdate('count', item.cartId, item.cartId, item.count + 1)}>감소</button>

                        <QuantityInput
                            type="number"
                            min="1"
                            value={item.count}
                            readOnly/>

                        <button onClick={() => handleUpdate('count', item.cartId, item.cartId,item.count + 1)}>증가</button>

                        <DeleteButton
                        onClick={()=>handleUpdate('delete',item.cartId,item.cartId)}>삭제</DeleteButton>
                    </ItemActions>
                </CartItem>
            ))}
            <CartSummary>
                <TotalPrice>합계: {userCart.reduce((total, item) => total + item.price * item.count, 0).toLocaleString()}원</TotalPrice>
                <CheckoutButton>결제하기</CheckoutButton>
            </CartSummary>
        </CartContainer>
    )
}

export default ShopCart;