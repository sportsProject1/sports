import {useEffect, useState} from "react";
import {fetchTokenData, putTokenData, putTokenJsonData} from "../../Server/ApiService";
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

    const handleCount = async (itemId, cartId, newCount) => {
        if (newCount < 1) return; // 최소 수량 제한
        const cartCount = {
            cartId: cartId,
            count: newCount
        };

        try {
            await putTokenJsonData(`/mypage/cart/update/count/${cartId}`, cartCount);
            // 성공적으로 업데이트된 경우 로컬 상태도 업데이트
            setUserCart(prevCart =>
                prevCart.map(item =>
                    item.cartId === cartId ? { ...item, count: newCount } : item
                ));
        } catch (error) {
            console.error('Failed to update count:', error);
        }
    };

    const handleChecked = async (itemId,cartId,checked) =>{
        const cartChecked = {
            cartId: cartId,
            isChecked: checked
        };
        try {
            await putTokenJsonData(`/mypage/cart/update/checkbox/${cartId}`,cartChecked);
            setUserCart(prevCart =>
                prevCart.map(item =>
                    item.cartId === cartId ? { ...item, isChecked: checked } : item
                ));
        } catch (err){
            console.error(err)
        }
    }

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
    console.log(userCart)


    return (
        <CartContainer>
            {userCart.map(item => (
                <CartItem key={item.cartId}>
                    <Checkbox
                        onChange={()=>handleChecked(item.cartId,item.cartId,!item.isChecked)}
                        checked={item.isChecked} />
                    <ItemImage src={item.imgurl} alt={item.name} />
                    <ItemInfo>
                        <ItemName>{item.title}</ItemName>
                        <ItemPrice>{item.price.toLocaleString()}원</ItemPrice>
                    </ItemInfo>
                    <ItemActions>
                        <button onClick={() => handleCount(item.cartId, item.cartId, item.count - 1)}>감소</button>

                        <QuantityInput
                            onChange={(e) => handleCount(item.id, item.cartId, parseInt(e.target.value, 10) || 1)}
                            type="number"
                            min="1"
                            value={item.count}/>

                        <button onClick={() => handleCount(item.cartId, item.cartId, item.count + 1)}>증가</button>

                        <DeleteButton>삭제</DeleteButton>
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