import { useEffect, useState, useRef } from "react";
import { fetchTokenData, postTokenJsonData } from "../../Server/ApiService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import LoadingPage from "../../Components/LoadingPage";

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
    const [paymentItem, setPaymentItem] = useState();
    const postcodeRef = useRef();

    useEffect(() => {
        fetchTokenData("/mypage/cart/checkout").then((res) => {
            setPaymentItem(res.data);
        });
    }, []);

    const handleAddressSearch = (setFieldValue) => {
        const openPostcode = () => {
            if (postcodeRef.current) {
                postcodeRef.current.open();
            }
        };

        if (!postcodeRef.current) {
            const script = document.createElement('script');
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                postcodeRef.current = new window.daum.Postcode({
                    oncomplete: (data) => {
                        setFieldValue("zipCode", data.zonecode); // 우편번호 설정
                        setFieldValue("roadAddress", data.roadAddress); // 도로명 주소 설정
                    },
                });
                openPostcode();
            };
            document.body.appendChild(script);
        } else {
            openPostcode();
        }
    };

    console.log(paymentItem);

    if (paymentItem) {
        return (
            <div>
                결제페이지
                <Formik
                    initialValues={{
                        name: '',
                        phone: '',
                        zipCode: '', // 우편번호 필드
                        roadAddress: '', // 도로명 주소 필드
                        detailAddress: '', // 상세 주소 필드
                        paymentMethod: '카드결제',
                        Address: '' // 주소 전체를 담을 필드
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        // Address 필드를 zipCode, roadAddress, detailAddress를 합쳐서 설정
                        values.Address = `${values.zipCode}, ${values.roadAddress}, ${values.detailAddress}`;

                        postTokenJsonData("/payment/process", values).then((res) => {
                            console.log(res, values);
                        }).catch((err) => {
                            console.log(err, values);
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
                                <Field
                                    name="zipCode"
                                    placeholder="우편번호"
                                    disabled // 수정 불가능
                                />
                                <button type="button" onClick={() => handleAddressSearch(setFieldValue)}>주소 검색</button>
                                <ErrorMessage name="zipCode" component="div" style={{ color: 'red' }} />
                            </div>
                            <div>
                                <Field
                                    name="roadAddress"
                                    placeholder="도로명 주소"
                                    disabled // 수정 불가능
                                />
                                <ErrorMessage name="roadAddress" component="div" style={{ color: 'red' }} />
                            </div>
                            <div>
                                <Field name="detailAddress" placeholder="상세 주소" />
                                <ErrorMessage name="detailAddress" component="div" style={{ color: 'red' }} />
                            </div>
                            <Field as="select" name="paymentMethod">
                                <option value="카드결제">카드결제</option>
                            </Field>
                            <p>체크된 상품들</p>
                            <ItemContainer>
                                {paymentItem.cartItems.map((item,idx)=>{
                                    return(
                                        <div key={idx}>
                                            <ItemImage src={item.itemImgUrl} alt="상품 이미지" />
                                            <div>
                                                <p>상품명: {item.itemTitle}</p>
                                                <p>수량: {item.count}</p>
                                                <p>가격: {item.itemPrice}</p>
                                            </div>
                                        </div>
                                        )

                                })}

                            </ItemContainer>
                            <p>최종 가격: {paymentItem.totalPrice}원</p>
                            <button type="submit" disabled={isSubmitting}>결제하기</button>
                        </FormBox>
                    )}
                </Formik>
            </div>
        );
    } else {
        return (
            <div>
                <LoadingPage/>
            </div>
        );
    }
}

export default Payment;
