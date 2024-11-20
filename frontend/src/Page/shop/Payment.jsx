import { useEffect, useState, useRef } from "react";
import { fetchTokenData, postTokenJsonData } from "../../Server/ApiService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FormBox = styled(Form)`
    display: flex;
    flex-direction: column;
    width: 50%;
    justify-content: center;
    margin: auto;
    > div {
        margin-bottom: 15px;
    }
    > input, select {
        padding: 15px;
        margin-bottom: 15px;
    }
    > p {
        padding: 15px;
    }
    > button {
        padding: 15px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
`;

const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
`;

const ItemImage = styled.img`
    width: 50px;
    height: 50px;
    margin-right: 15px;
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
        fetchTokenData("/mypage/cart/checkout").then((res) => {
            setPaymentItem(res.data);
        });
    }, []);

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
        <div>
            <h1>결제페이지</h1>
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
                        console.log(res);
                        navigate('/history');
                    }).catch((err) => {
                        console.log(err);
                    });
                }}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <FormBox>
                        <div>
                            <Field name="name" placeholder="이름" />
                            <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <Field name="phone" placeholder="핸드폰" />
                            <ErrorMessage name="phone" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <Field name="zipCode" placeholder="우편번호" disabled />
                            <button type="button" onClick={() => handleAddressSearch(setFieldValue)}>주소 검색</button>
                            <ErrorMessage name="zipCode" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <Field name="roadAddress" placeholder="도로명 주소" disabled />
                            <ErrorMessage name="roadAddress" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <Field name="detailAddress" placeholder="상세 주소" />
                            <ErrorMessage name="detailAddress" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <Field as="select" name="paymentMethod">
                                <option value="신용카드">신용카드</option>
                                <option value="무통장입금">무통장입금</option>
                                <option value="카카오페이">카카오페이</option>
                            </Field>
                        </div>
                        <p>결제상품</p>
                        {paymentItem.cartItems.filter(item => item.checked).map((item) => (
                            <ItemContainer key={item.cartId}>
                                <ItemImage src={item.itemImgUrl.split(",")[0]} alt={item.itemTitle} />
                                <div>
                                    <p>상품명: {item.itemTitle}</p>
                                    <p>수량: {item.count}</p>
                                    <p>가격: {item.itemPrice}원</p>
                                </div>
                            </ItemContainer>
                        ))}
                        <p>최종 가격: {totalPrice}원</p>
                        <button type="submit" disabled={isSubmitting}>결제하기</button>
                    </FormBox>
                )}
            </Formik>
        </div>
    );
}

export default Payment;