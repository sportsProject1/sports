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
    CheckoutButton,
    DeleteAllButton,
    EmptyCartMessage,
    ShopLink
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
            } else {
            }
        } catch (error) {
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
                const userConfirmed = window.confirm("정말 이 항목을 삭제하시겠습니까?");
                if (!userConfirmed) return;
                await deleteTokenData(endpoint, payload);
                alert("상품이 성공적으로 삭제되었습니다.");
                // 삭제 후 최신 카트 데이터 다시 불러오기
                fetchUpdatedCart();
            } else {
                await putTokenJsonData(endpoint, payload);
                // 수량 업데이트 후 최신 카트 데이터 다시 불러오기
                fetchUpdatedCart();
            }
        } catch (error) {
            alert("삭제에 실패했습니다");
        }
    };

    // 카트 데이터를 다시 불러오는 함수
    const fetchUpdatedCart = () => {
        fetchTokenData("/mypage/cart").then((res) => {
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

    //선택항목삭제함수
    const handleDeleteCheckedItems = async () => {
        const userConfirmed = window.confirm("선택한 항목들을 삭제하시겠습니까?");
        if (!userConfirmed) return;
        try {
            const response = await deleteTokenData('/mypage/cart/delete/checked');

            if (response.status === 200) {
            } else {
                alert("선택 항목 삭제에 실패했습니다.");
            }
        } catch (error) {
        } finally {
            fetchUpdatedCart();
        }
    };

    if (userCart.length === 0) {
        return (
                <div>
                   <EmptyCartMessage>장바구니가 비었습니다.</EmptyCartMessage>
                   <ShopLink onClick={() => navigate('/shop')}>쇼핑하러 가기</ShopLink>
                </div>
        );
    }


    return (
        <CartContainer>
            <DeleteAllButton onClick={handleDeleteCheckedItems}>선택 항목 삭제</DeleteAllButton>
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
                                <ItemImage src={item.itemImgUrl.split(",")[0]} alt={item.itemTitle} />
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