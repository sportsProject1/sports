// RegisterForm.jsx
import React, {useState, useRef, useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useImageUploader from "../../hooks/useImageUploader";
import { FormWrap } from "../../styled/user/UserStyled";
import { Title } from "../../styled/Common";
import { postData } from "../../Server/ApiServiceNoToken";
import ProfileImageUpload from "./userComponents/ProfileImageUpload";
import FormFields from "./userComponents/FormFields";
// import ValidationMessages from "./userComponents/ValidationMessages";
import {values} from "lodash-es";
import axios from "axios";

function RegisterForm({ onSuccess }) {
    const { images, handleImageChange, resetImages } = useImageUploader(false);
    const [isImageDeleted, setIsImageDeleted] = useState(false);

    const [isAvailable, setIsAvailable] = useState(null );

    const postcodeRef = useRef();

    const formatPhoneNumber = (value) => {
        const onlyNumbers = value.replace(/\D/g, "");
        if (onlyNumbers.length <= 3) return onlyNumbers;
        if (onlyNumbers.length <= 7) return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
        return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            nickname: '',
            phone: '',
            email: '',
            address: '',
            zipCode: '', // 우편번호를 위한 필드
            roadAddress: '', // 도로명 주소를 위한 필드
            detailAddress: '', // 상세 주소를 위한 필드
            file: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().min(3, '아이디는 최소 6자 이상이어야 합니다.')
                .required('아이디는 6~20자 사이여야 합니다.')
                .test('check-username', '이미 사용 중인 아이디입니다.', async (value) => {
                    if (!value) return false;
                    try {
                        const response = await axios.get('http://localhost:8090/oauth2/check-username', {
                            params: { username: value },
                        });
                        // 서버의 응답 값을 사용하여 테스트의 결과를 반환
                        const isDuplicate = response.data.isDuplicate;
                        return !isDuplicate; // 중복이면 false 반환, 아니면 true 반환
                    } catch (error) {
                        console.error('Error checking username:', error);
                        return false;
                    }
                }),
            password: Yup.string().min(8, '비밀번호는 최소 8자 이상 영어와 숫자를 섞어주세요.').required('비밀번호를 입력하세요.'),
            nickname: Yup.string().min(2, "이름은 최소 두 글자 이상이어야 합니다.").required('이름을 입력하세요.'),
            phone: Yup.string().matches(/^\d{3}-\d{4}-\d{4}$/, '형식이 올바르지 않습니다 (예: 010-1234-5678).').required('전화번호를 입력하세요.'),
            email: Yup.string().email('유효한 이메일을 입력하세요.').required('이메일을 입력하세요.'),
            detailAddress: Yup.string().required('상세주소를 입력하세요.'), // 상세주소에 대한 유효성 검사 추가
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("password", values.password);
            formData.append("nickname", values.nickname);
            formData.append("phone", values.phone);
            formData.append("email", values.email);
            formData.append("address", `${values.zipCode}, ${values.roadAddress}, ${values.detailAddress}`); // 주소를 콤마로 구분하여 담기

            if (images.length > 0) {
                formData.append("file", images[0].file);
            } else if (isImageDeleted) {
                formData.append("file", null);
            }
            try {
                await postData("/register", formData);
                onSuccess();
            } catch (error) {
                console.error("회원가입 실패:", error);
            }
        },
    });


    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        formik.setFieldValue("phone", formattedPhone);
    };

    const handleAddressSearch = () => {
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
                        formik.setFieldValue("zipCode", data.zonecode); // 우편번호
                        formik.setFieldValue("roadAddress", data.roadAddress); // 도로명 주소
                    },
                });
                openPostcode();
            };
            document.body.appendChild(script);
        } else {
            openPostcode();
        }
    };

    return (
        <FormWrap onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Title>회원가입</Title>
            <ProfileImageUpload
                isImageDeleted={isImageDeleted}
                images={images}
                handleImageChange={handleImageChange}
                resetImages={resetImages}
                setIsImageDeleted={setIsImageDeleted}
                update={true}
            />
            <FormFields
                formik={formik}
                handlePhoneChange={handlePhoneChange}
                handleAddressSearch={handleAddressSearch}
                isSignUp={"sign"}
            />
{/*             <ValidationMessages isAvailable={isAvailable} formik={formik} /> */}
        </FormWrap>
    );
}

export default RegisterForm;
