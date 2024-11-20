import React, { useEffect, useState } from 'react';
import { fetchTokenData } from '../../Server/ApiService';
import {
    HistoryContainer,
    Title,
    PaymentItem,
    PaymentHeader,
    PaymentDate,
    PaymentMethod,
    PaymentPrice,
    PaymentDetails,
    PaymentDetailItem,
    PaymentItemImage,
    PaymentDetailContent,
    LoadMoreButton,
    PaymentDetailsTitle
} from '../../styled/Shop/HistoryStyles';

function History() {
    const [paymentHistory, setPaymentHistory] = useState([]);  // 결제 내역 상태
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState(null);  // 에러 상태
    const [itemsToShow, setItemsToShow] = useState(5);  // 처음에 보여줄 결제 내역 수

    useEffect(() => {
        const loadPaymentHistory = async () => {
            try {
                const response = await fetchTokenData("/payment/history");
                if (response.data && Array.isArray(response.data)) {
                    setPaymentHistory(response.data);
                } else {
                    throw new Error("잘못된 데이터");
                }
                setLoading(false);
            } catch (err) {
                console.error("결제 내역 불러오기 오류", err);
                setError("결제 내역을 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        loadPaymentHistory();
    }, [itemsToShow]);  // itemsToShow가 바뀔 때마다 다시 호출

    // 더 보기 버튼 클릭 시 호출되는 함수
    const loadMorePayments = () => {
        setItemsToShow(prev => prev + 5);  // 더 많은 결제 내역 로드
    };

    // 결제 항목 클릭 시 세부 정보를 펼치거나 닫는 함수
    const togglePaymentDetails = (id) => {
        setPaymentHistory(prevState =>
            prevState.map(payment =>
                payment.paymentData.id === id
                    ? { ...payment, isOpen: !payment.isOpen }  // 상세 정보 열기/닫기 토글
                    : payment
            )
        );
    };

    if (loading) return <div>로딩 중...</div>;  // 로딩 중이면 표시
    if (error) return <div>{error}</div>;  // 에러가 있으면 표시

    const sortedPaymentHistory = [...paymentHistory].reverse();  // 결제 내역을 최신순으로 정렬

    return (
        <HistoryContainer>
            <Title>결제 내역</Title>
            {sortedPaymentHistory.slice(0, itemsToShow).map(paymentItem => {
                const { paymentData } = paymentItem;

                return (
                    <PaymentItem key={paymentData.id} onClick={() => togglePaymentDetails(paymentData.id)}>
                        <PaymentHeader>
                            <PaymentDate>{new Date(paymentData.paymentTime).toLocaleString()}</PaymentDate>
                            <PaymentMethod>{paymentData.paymentMethod}</PaymentMethod>
                        </PaymentHeader>
                        <PaymentPrice>총 금액: {paymentData.totalPrice.toLocaleString()}원</PaymentPrice>

                        {/* 결제 항목 상세 정보 */}
                        {paymentItem.isOpen && (
                            <PaymentDetails>
                                <div>배송 주소: {paymentData.deliveryAddress}</div>
                                <div>전화번호: {paymentData.phoneNumber}</div>
                                <div>구매자 이름: {paymentData.name}</div>
                                <PaymentDetailsTitle>구매 항목</PaymentDetailsTitle>
                                <ul>
                                    {paymentData.paymentDetails.map((item, idx) => (
                                        <PaymentDetailItem key={idx}>
                                            <PaymentItemImage src={item.itemUrl.split(",")[0]} alt={item.itemTitle} />
                                            <PaymentDetailContent>
                                                <div>상품명: {item.itemTitle}</div>
                                                <div>가격: {item.itemPrice.toLocaleString()}원</div>
                                                <div>수량: {item.itemCount}</div>
                                            </PaymentDetailContent>
                                        </PaymentDetailItem>
                                    ))}
                                </ul>
                            </PaymentDetails>
                        )}
                    </PaymentItem>
                );
            })}

            {/* 더 보기 버튼 */}
            {itemsToShow < paymentHistory.length && (
                <LoadMoreButton onClick={loadMorePayments}>더 보기</LoadMoreButton>
            )}
        </HistoryContainer>
    );
}

export default History;