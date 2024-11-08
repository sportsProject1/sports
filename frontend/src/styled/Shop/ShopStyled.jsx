import styled from 'styled-components';

// 장바구니 컨테이너
export const CartContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    max-width: 800px;
    margin: 20px auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// 개별 아이템 컨테이너
export const CartItem = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    &:last-child {
        border-bottom: none;
    }
`;

// 아이템 이미지
export const ItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 15px;
`;

// 아이템 정보
export const ItemInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

// 아이템 이름과 가격
export const ItemName = styled.span`
    font-size: 16px;
    font-weight: bold;
`;

export const ItemPrice = styled.span`
    font-size: 14px;
    color: #555;
`;

// 수량 및 체크박스, 삭제 버튼
export const ItemActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const QuantityInput = styled.input`
    width: 40px;
    padding: 5px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

export const DeleteButton = styled.button`
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e60000;
    }
`;

// 체크박스 스타일
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
    cursor: pointer;
`;

// 합계 및 결제 버튼 컨테이너
export const CartSummary = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #ddd;
`;

export const TotalPrice = styled.span`
    font-size: 18px;
    font-weight: bold;
`;

export const CheckoutButton = styled.button`
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }
`;