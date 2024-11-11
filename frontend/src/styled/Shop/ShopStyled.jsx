import styled from 'styled-components';

// 상품 상세페이지
// 상품 상세 페이지 컨테이너

// 상품 상세 페이지 컨테이너
export const ProductDetailContainer = styled.div`
    display: flex;
    gap: 40px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    max-width: 1200px;
    margin: 40px auto;
`;

// 이미지 갤러리 컨테이너
export const ProductImageGallery = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

// 상품 이미지 스타일
export const ProductImage = styled.img`
    width: 400px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// 상품 정보 컨테이너
export const ProductInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
`;

// 상품명 스타일
export const ProductName = styled.h1`
    font-size: 28px;
    font-weight: bold;
    color: #333;
`;

// 할인 정보 스타일
export const ProductDiscount = styled.span`
    font-size: 18px;
    color: #e60023;
    font-weight: bold;
`;

// 원래 가격 스타일 (취소선)
export const ProductOriginalPrice = styled.span`
    font-size: 16px;
    color: #888;
    text-decoration: line-through;
`;

// 현재 가격 스타일
export const ProductPrice = styled.span`
    font-size: 24px;
    color: #e60023;
    font-weight: bold;
`;

// 혜택 정보 스타일
export const ProductBenefits = styled.div`
    font-size: 14px;
    color: #555;
    border-top: 1px solid #ddd;
    padding-top: 10px;
`;

// 수량 선택 및 버튼 컨테이너
export const QuantityContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;


// 장바구니 버튼 스타일
export const AddToCartButton = styled.button`
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

// 삭제 및 수정 버튼 스타일
export const ActionButton = styled.button`
    background-color: #d9534f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #c9302c;
    }

    &:last-child {
        margin-right: 0;
    }
`;



// 상품 상세페이지 끝




// 장바구니 페이지
// 장바구니 테이블 컨테이너
export const CartContainer = styled.div`
    width: 80%; /* 컨테이너 너비 설정 */
    margin: 20px auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
`;

// 테이블 스타일
export const CartTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
`;

// 테이블 헤더 스타일
export const TableHeader = styled.th`
    padding: 10px;
    background-color: #e0e0e0;
    border: 1px solid #ddd;
    text-align: center; /* 가운데 정렬 */
    font-weight: bold;
`;

// 테이블 행 스타일
export const TableRow = styled.tr`
    border-bottom: 1px solid #ddd;

    &:last-child {
        border-bottom: none;
    }
`;

// 테이블 데이터 스타일
export const TableData = styled.td`
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center; /* 좌우 가운데 정렬 */
    vertical-align: middle; /* 상하 가운데 정렬 */
`;

// 이미지 스타일
export const ItemImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
`;

// 수량 입력 스타일
export const QuantityInput = styled.input`
    width: 40px;
    padding: 5px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

// 삭제 버튼 스타일
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

// 총합 및 결제 버튼 컨테이너
export const CartSummary = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 10px;
    border-top: 1px solid #ddd;
`;

// 총합 가격 스타일
export const TotalPrice = styled.span`
    font-size: 18px;
    font-weight: bold;
`;

// 결제 버튼 스타일
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
export const DeleteAllButton = styled.button`
    background-color: #d9534f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    float: right;
    transition: background-color 0.3s;

    &:hover {
        background-color: #c9302c;
    }
`;