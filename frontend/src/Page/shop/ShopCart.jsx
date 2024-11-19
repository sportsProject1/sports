import { useEffect, useState } from "react";
import { deleteTokenData, fetchTokenData, putTokenJsonData } from "../../Server/ApiService";
import {
    CartContainer,
    CartTable,
    TableHeader,
    TableRow,
    TableData,
    ItemImage,
    QuantityInput,
    DeleteButton,
    CartSummary,
    TotalPrice,
    CheckoutButton, DeleteAllButton
} from "../../styled/Shop/ShopStyled";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../Components/LoadingPage";

function ShopCart() {
    const [userCart, setUserCart] = useState([]);
    const navigate = useNavigate();

    const handleUpdate = async (type, itemId, cartId, value) => {
        if (type === 'count' && value < 1) return;

        const payload = {
            cartId: cartId,
            [type]: value
        };

        const endpoint = type === 'count'
            ? `/mypage/cart/update/count/${itemId}`
            : type === 'delete'
                ? `/mypage/cart/delete/${itemId}`
                : `/mypage/cart/update/checkbox/${itemId}`;

        try {
            if (type === 'delete') {
                await deleteTokenData(endpoint, payload);
                setUserCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
            } else {
                await putTokenJsonData(endpoint, payload);
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
        fetchTokenData("/mypage/cart").then((res) => {
            console.log(res);
            setUserCart(res.data.cartItems);
        });
    }, []);

    useEffect(() => {
        // 카트 내용이 변경될 때마다 서버에 변경 사항 반영
        if (userCart.length > 0) {
            // 예시로 서버에 변경 사항을 반영하는 API 호출
            putTokenJsonData("/mypage/cart/update", { cartItems: userCart })
                .then((res) => {
                    console.log("Cart updated successfully", res);
                })
                .catch((error) => {
                    console.error("Failed to update cart", error);
                });
        }
    }, [userCart]);

    // 체크된 항목들의 가격 합계 계산
    const totalPrice = userCart
        .filter(item => item.isChecked)  // isChecked로 상태 확인
        .reduce((total, item) => total + item.itemPrice * item.count, 0);

    if (userCart) {
        return (
            <CartContainer>
                <DeleteAllButton>선택 항목 삭제</DeleteAllButton>
                <CartTable>
                    <thead>
                        <tr>
                            <TableHeader style={{ width: '10%' }}>선택</TableHeader>
                            <TableHeader style={{ width: '10%' }}>사진</TableHeader>
                            <TableHeader style={{ width: '30%' }}>상품명</TableHeader>
                            <TableHeader style={{ width: '10%' }}>가격</TableHeader>
                            <TableHeader style={{ width: '10%' }}>수량</TableHeader>
                            <TableHeader style={{ width: '10%' }}>삭제</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {userCart.map(item => (
                            <TableRow key={item.cartId}>
                                <TableData>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleUpdate('isChecked', item.cartId, item.cartId, !item.isChecked)}
                                        checked={!!item.isChecked} // item.isChecked가 undefined일 경우 false로 처리
                                    />
                                </TableData>
                                <TableData>
                                    <ItemImage src={item.itemImgUrl} alt={item.name}/>
                                </TableData>
                                <TableData>{item.itemTitle}</TableData>
                                <TableData>{item.itemPrice.toLocaleString()}원</TableData>
                                <TableData>
                                    <button onClick={() => handleUpdate('count', item.cartId, item.cartId, item.count - 1)}>▼</button>
                                    <QuantityInput
                                        type="number"
                                        min="1"
                                        value={item.count}
                                        readOnly
                                    />
                                    <button onClick={() => handleUpdate('count', item.cartId, item.cartId, item.count + 1)}>▲</button>
                                </TableData>
                                <TableData>
                                    <DeleteButton onClick={() => handleUpdate('delete', item.cartId, item.cartId)}>삭제</DeleteButton>
                                </TableData>
                            </TableRow>
                        ))}
                    </tbody>
                </CartTable>
                <CartSummary>
                    <TotalPrice>합계: {totalPrice.toLocaleString()}원</TotalPrice>
                    <CheckoutButton onClick={() => navigate('/shop/payment')}>결제하기</CheckoutButton>
                </CartSummary>
            </CartContainer>
        );
    } else {
        return (
            <div><LoadingPage /></div>
        );
    }
}

export default ShopCart;