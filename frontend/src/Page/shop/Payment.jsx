import { useEffect, useState, useRef } from "react";
import { fetchTokenData, postTokenJsonData } from "../../Server/ApiService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    max-width: 800px;
    margin: 30px auto;
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    text-align: center;
    font-size: 28px;
    margin-bottom: 30px;
    color: #333;
`;

const FormBox = styled(Form)`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputField = styled.div`
    display: flex;
    flex-direction: column;
`;

const Input = styled(Field)`
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 5px;
    outline: none;
    transition: border-color 0.3s;
    &:focus {
        border-color: #007bff;
    }
`;

const Button = styled.button`
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    &:hover {
        background-color: #0056b3;
    }
    &:disabled {
        background-color: #ddd;
        cursor: not-allowed;
    }
`;

const ErrorText = styled.div`
    color: red;
    font-size: 14px;
`;

const ItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 5px;
`;

const ItemImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 15px;
`;

const ItemDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const ItemPrice = styled.p`
    font-size: 16px;
    color: #007bff;
    font-weight: bold;
`;

const TotalPrice = styled.p`
    text-align: right;
    font-size: 20px;
    color: #333;
    font-weight: bold;
    margin-top: 20px;
`;

const CheckoutButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;
`;

const AddressSearchContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

const AddressSearchButton = styled(Button)`
    padding: 8px 12px;
    font-size: 14px;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    &:hover {
        background-color: #0056b3;
    }
`;

const PaymentMethodField = styled(InputField)`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const PaymentMethodSelect = styled(Field)`
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    outline: none;
    transition: border-color 0.3s;
    &:focus {
        border-color: #007bff;
    }
`;

const Label = styled.label`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
`;

const validationSchema = Yup.object({
    name: Yup.string()
        .min(2, '이름은 2글자 이상이어야 합니다.')
        .max(5, '이름은 5글자 이하이어야 합니다.')
        .required('이름을 입력해주세요.'),
    phone: Yup.string()
        .matches(/^\d{3}-\d{3,4}-\d{4}$/, '올바른 핸드폰 번호 양식이어야 합니다. (예: 010-1234-5678)')
        .required('핸드폰 번호를 입력해주세요.'),
    detailAddress: Yup.string().required('상세 주소를 입력해주세요.'),
});

function Payment() {
    const [paymentItem, setPaymentItem] = useState(null);
    const postcodeRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('잘못된 접근입니다. 로그인페이지로 이동합니다.');
            navigate('/login');
        } else {
            fetchTokenData("/mypage/cart/checkout").then((res) => {
                setPaymentItem(res.data);
            });
        }
    }, [navigate]);

    const handleAddressSearch = (setFieldValue) => {
        const openPostcode = () => postcodeRef.current && postcodeRef.current.open();

        if (!postcodeRef.current) {
            const script = document.createElement('script');
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                postcodeRef.current = new window.daum.Postcode({
                    oncomplete: (data) => {
                        setFieldValue("zipCode", data.zonecode);
                        setFieldValue("roadAddress", data.roadAddress);
                    },
                });
                openPostcode();
            };
            document.body.appendChild(script);
        } else {
            openPostcode();
        }
    };

    const formatPhoneNumberForDisplay = (phoneNumber) => phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    const removePhoneNumberHyphens = (phoneNumber) => phoneNumber.replace(/-/g, '');

    if (!paymentItem) return <div>로딩중...</div>;

    const [zipCode, roadAddress, detailAddress] = paymentItem.deliveryAddress.split(',').map(addr => addr.trim());
    const totalPrice = paymentItem.cartItems.reduce((sum, item) => item.checked ? sum + (item.itemPrice * item.count) : sum, 0);

    return (
        <Container>
            <Title>결제 페이지</Title>
            <Formik
                initialValues={{
                    name: paymentItem.name || '',
                    phone: formatPhoneNumberForDisplay(paymentItem.phoneNumber) || '',
                    zipCode: zipCode || '',
                    roadAddress: roadAddress || '',
                    detailAddress: detailAddress || '',
                    paymentMethod: '카드결제',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {

                    const userConfirmed = window.confirm("결제를 진행하시겠습니까?");

                    if (!userConfirmed) {
                        alert("결제가 취소되었습니다.");
                        navigate('/shop/cart');
                        return;
                    }

                    const formattedPhone = removePhoneNumberHyphens(values.phone);
                    const deliveryAddress = `${values.zipCode}, ${values.roadAddress}, ${values.detailAddress}`;
                    const cartItems = paymentItem.cartItems.filter(item => item.checked);

                    const dataToSend = {
                        message: paymentItem.message,
                        cartItems,
                        deliveryAddress,
                        phoneNumber: formattedPhone,
                        name: values.name,
                        paymentMethod: values.paymentMethod,
                        totalPrice,
                    };

                    postTokenJsonData("/payment/process", dataToSend).then((res) => {
                        alert('결제가 완료되었습니다.');
                        navigate('/history');
                    }).catch((err) => {
                        alert('결제가 실패되었습니다.');
                    });
                }}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <FormBox>
                        <InputField>
                            <Label>이름</Label>
                            <Input name="name" placeholder="이름을 입력해주세요" />
                            <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                        </InputField>
                        <InputField>
                            <Label>전화번호</Label>
                            <Input name="phone" placeholder="전화번호를 입력해주세요" />
                            <ErrorMessage name="phone" component="div" style={{ color: 'red' }} />
                        </InputField>
                        <InputField>
                            <Label>주소</Label>
                            <AddressSearchContainer>
                                <Input name="zipCode" placeholder="우편번호" disabled />
                                <AddressSearchButton type="button" onClick={() => handleAddressSearch(setFieldValue)}>주소 검색</AddressSearchButton>
                            </AddressSearchContainer>
                            <ErrorMessage name="zipCode" component="div" style={{ color: 'red' }} />
                        </InputField>
                        <InputField>
                            <Input name="roadAddress" placeholder="도로명 주소" disabled />
                            <ErrorMessage name="roadAddress" component="div" style={{ color: 'red' }} />
                        </InputField>
                        <InputField>
                            <Input name="detailAddress" placeholder="상세 주소" />
                            <ErrorMessage name="detailAddress" component="div" style={{ color: 'red' }} />
                        </InputField>
                        <InputField>
                                <Label>결제 수단</Label>
                                <PaymentMethodSelect as="select" name="paymentMethod">
                                    <option value="신용카드">신용카드</option>
                                    <option value="무통장입금">무통장입금</option>
                                    <option value="카카오페이">카카오페이</option>
                                </PaymentMethodSelect>
                        </InputField>

                        <Label>결제 상품</Label>
                        {paymentItem.cartItems.filter(item => item.checked).map((item) => (
                            <ItemContainer key={item.cartId}>
                                <ItemImage src={item.itemImgUrl.split(",")[0]} alt={item.itemTitle} />
                                <ItemDetails>
                                    <p>상품명: {item.itemTitle}</p>
                                    <p>수량: {item.count}</p>
                                    <ItemPrice>{item.itemPrice.toLocaleString()}원</ItemPrice>
                                </ItemDetails>
                            </ItemContainer>
                        ))}

                        <TotalPrice>총 결제금액: {totalPrice.toLocaleString()}원</TotalPrice>

                        <CheckoutButtonContainer>
                            <Button type="submit" disabled={isSubmitting}>결제하기</Button>
                        </CheckoutButtonContainer>
                    </FormBox>
                )}
            </Formik>
        </Container>
    );
}

export default Payment;