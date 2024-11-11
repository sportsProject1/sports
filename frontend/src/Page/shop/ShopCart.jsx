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
        fetchTokenData("/mypage/cart").then(
            (data) => {
                const itemsWithCount = data.data.map(cartItem => ({
                    ...cartItem.item,
                    count: cartItem.count,
                    cartId: cartItem.id,
                    isChecked: cartItem.checked,
                }));
                setUserCart(itemsWithCount);
            }
        );
    }, []);
    console.log(userCart);

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
                                checked={item.isChecked}
                            />
                        </TableData>
                        <TableData>
                            <ItemImage src={item.imgurl} alt={item.name} />
                        </TableData>
                        <TableData>{item.title}</TableData>
                        <TableData>{item.price.toLocaleString()}원</TableData>
                        <TableData>
                            <button onClick={() => handleUpdate('count', item.cartId, item.cartId, item.count - 1)}>▼
                            </button>
                            <QuantityInput
                                type="number"
                                min="1"
                                value={item.count}
                                readOnly
                            />
                            <button onClick={() => handleUpdate('count', item.cartId, item.cartId, item.count + 1)}>▲
                            </button>
                        </TableData>
                        <TableData>
                            <DeleteButton onClick={() => handleUpdate('delete', item.cartId, item.cartId)}>삭제</DeleteButton>
                        </TableData>
                    </TableRow>
                ))}
                </tbody>
            </CartTable>
            <CartSummary>
                <TotalPrice>합계: {userCart.reduce((total, item) => total + item.price * item.count, 0).toLocaleString()}원</TotalPrice>
                <CheckoutButton onClick={() => navigate('/shop/payment')}>결제하기</CheckoutButton>
            </CartSummary>
        </CartContainer>
    );
}

export default ShopCart;
