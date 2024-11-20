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

    // 체크박스 상태 업데이트 함수
    const handleUpdateChecked = async (cartId, checked) => {
        // UI에서 바로 반영
        setUserCart(prevCart =>
            prevCart.map(item =>
                item.cartId === cartId ? { ...item, isChecked: checked } : item
            )
        );

        try {
            const payload = { isChecked: checked };
            const response = await putTokenJsonData(`/mypage/cart/update/checkbox/${cartId}`, payload);

            if (response.status === 200) {
                console.log("체크박스 상태 업데이트 성공");
            } else {
                console.error("Failed to update checkbox status:", response);
            }
        } catch (error) {
            console.error("Failed to update checked status:", error);
        }
    };

    // 카트 업데이트 함수 (수량, 삭제 등)
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
                // 삭제 후 최신 카트 데이터 다시 불러오기
                fetchUpdatedCart();
            } else {
                await putTokenJsonData(endpoint, payload);
                // 수량 업데이트 후 최신 카트 데이터 다시 불러오기
                fetchUpdatedCart();
            }
        } catch (error) {
            console.error(`Failed to update ${type}:`, error);
        }
    };

    // 카트 데이터를 다시 불러오는 함수
    const fetchUpdatedCart = () => {
        fetchTokenData("/mypage/cart").then((res) => {
            console.log(res);
            const cartItems = res.data.cartItems;

            // 카트 아이템의 체크 상태를 초기화하여 반영
            setUserCart(cartItems.map(item => ({
                ...item,
                isChecked: item.checked || false  // 서버에서 받은 체크 상태 반영
            })));
        });
    };

    useEffect(() => {
        // 페이지 진입 시 카트 데이터 불러오기
        fetchUpdatedCart();
    }, []);

    // 체크된 항목들의 가격 합계 계산
    const totalPrice = userCart
        .filter(item => item.isChecked)  // isChecked로 상태 확인
        .reduce((total, item) => total + item.itemPrice * item.count, 0);

    if (userCart.length === 0) {
        return <LoadingPage />;
    }

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
                                    onChange={() => handleUpdateChecked(item.cartId, !item.isChecked)}  // 체크박스 상태 업데이트
                                    checked={item.isChecked}  // isChecked 상태 반영
                                />
                            </TableData>
                            <TableData>
                                <ItemImage src={item.itemImgUrl} alt={item.itemTitle} />
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
}

export default ShopCart;