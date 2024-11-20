import styled from 'styled-components';

// 상품 상세페이지
// 상품 상세 페이지 컨테이너
export const ProductDetailContainer = styled.div`
    display: flex;
    gap: 40px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    max-width: 1200px;
    margin: 40px auto;
    justify-content: space-between;
    flex-wrap: wrap;
`;

// 이미지 갤러리 컨테이너 (왼쪽에 배치)
export const ProductImageGallery = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1; /* 왼쪽 부분에 50% 크기 지정 */
    max-width: 480px;
`;

// 상품 이미지 스타일 (크기 600px x 700px)
export const ProductImage = styled.img`
    width: 100%;
    height: auto;
    max-width: 480px;
    max-height: 560px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// 상품 정보 컨테이너 (오른쪽에 배치)
export const ProductInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
    justify-content: flex-start;
    max-width: 540px;
    padding-top: 20px;
`;

// 상품명 스타일 (크기 키우기)
export const ProductName = styled.h1`
    font-size: 36px; /* 좀 더 큰 크기로 설정 */
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
`;

// 상품 가격 스타일
export const ProductPrice = styled.span`
    font-size: 20px;
    color: #e60023;
    font-weight: bold;
    margin-bottom: 10px;
`;

// 혜택 정보 스타일
export const ProductBenefits = styled.div`
    font-size: 14px;
    color: #555;
    display: flex;
    gap: 20px;
    flex-wrap: nowrap;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    padding-top: 10px;
`;

// 상품 설명 스타일
export const ProductDescription = styled.p`
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 20px;
    min-height: 250px;
    padding-bottom: 10px;
`;

// 수량 버튼 컨테이너
export const QuantityContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: flex-start;
`;

// 수량 변경 버튼 스타일 (수량 조정 버튼 - , +)
export const QuantityButton = styled.button`
    background-color: #f1f1f1;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 100px;
    padding: 9px 15px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 40px;
    height: 40px;
    font-weight: bold;

    &:hover {
        background-color: #e6e6e6;
    }

    &:disabled {
        background-color: #f8f8f8;
        color: #aaa;
        cursor: not-allowed;
    }
`;


// 수정된 수량 입력 스타일
export const StyledQuantityInput = styled.input`
    width: 60px;
    height: 40px;
    padding-left: 13px;
    text-align: center;
    font-size: 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
    font-weight: bold;
`;

// 장바구니 버튼 스타일
export const AddToCartButton = styled.button`
    background-color: #0C48C5;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 20px;
    flex-shrink: 0;
    transition: background-color 0.3s;

    &:hover {
        background-color: royalblue;
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

export const TotalPriceContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
`;

export const TotalPriceText = styled.span`
    color: #e60023;  // 총 가격을 강조하는 색상
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