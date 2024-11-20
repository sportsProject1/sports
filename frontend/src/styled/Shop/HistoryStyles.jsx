import styled from "styled-components";

// 전체 결제 내역 컨테이너
export const HistoryContainer = styled.div`
    padding: 20px;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    margin-left: 10%;
    margin-right: 10%;
`;

// 제목 스타일
export const Title = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
`;

// 결제 항목 스타일
export const PaymentItem = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #f1f1f1;
    }
`;

// 결제 항목 헤더
export const PaymentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    gap: 30px;
`;

// 결제 날짜
export const PaymentDate = styled.span`
    font-size: 1rem;
    color: #333;
`;

// 결제 방법
export const PaymentMethod = styled.span`
    font-size: 1rem;
    color: #555;
`;

// 결제 금액
export const PaymentPrice = styled.span`
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
`;

// 결제 상세 정보
export const PaymentDetails = styled.div`
    margin-top: 10px;
    margin-bottom: 0px;
    padding-left: 20px;
    padding-bottom: 20px;
    font-size: 0.9rem;
`;

export const PaymentDetailsTitle = styled.h3`
    margin-top: 10px;
    margin-bottom: 10px;
`;

// 결제 항목 상세 정보
export const PaymentDetailItem = styled.li`
    display: flex;
    flex-direction: row;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// 결제 항목 이미지
export const PaymentItemImage = styled.img`
    width: 100px;
    height: 100px;
    margin-right: 15px;
    border-radius: 8px;
    object-fit: cover;
`;

// 결제 항목 상세 내용
export const PaymentDetailContent = styled.div`
    flex: 1;
    font-size: 1rem;
    margin-left: 15px;

    div {
        margin-bottom: 12px;
    }

    div:last-child {
        margin-bottom: 0;
    }
`;

// 더 보기 버튼
export const LoadMoreButton = styled.button`
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: block;
    margin: 20px auto;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }
`;