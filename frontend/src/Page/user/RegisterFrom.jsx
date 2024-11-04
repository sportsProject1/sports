// RegisterForm.jsx
import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useImageUploader from "../../hooks/useImageUploader";
import {FormWrap, RegisterFormWrap} from "../../styled/UserStyled";
import { postData } from "../../Server/ApiServiceNoToken";
import ProfileImageUpload from "./userComponents/ProfileImageUpload";
import FormFields from "./userComponents/FormFields";
import ValidationMessages from "./userComponents/ValidationMessages";

function RegisterForm({ onSuccess }) {
    const { images, handleImageChange, resetImages } = useImageUploader(false);
    const [isImageDeleted, setIsImageDeleted] = useState(false); // 이미지 삭제 여부를 추적하는 상태 변수

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
            file: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().min(3, '아이디는 최소 6자 이상이어야 합니다.').required('아이디는 6~20자 사이여야 합니다.'),
            password: Yup.string().min(8, '비밀번호는 최소 8자 이상 영어와 숫자를 섞어주세요.').required('비밀번호를 입력하세요.'),
            nickname: Yup.string().min(2, "이름은 최소 두 글자 이상이어야 합니다.").required('이름을 입력하세요.'),
            phone: Yup.string().matches(/^\d{3}-\d{4}-\d{4}$/, '형식이 올바르지 않습니다 (예: 010-1234-5678).').required('전화번호를 입력하세요.'),
            email: Yup.string().email('유효한 이메일을 입력하세요.').required('이메일을 입력하세요.'),
            address: Yup.string().required('주소를 입력하세요.'),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("password", values.password);
            formData.append("nickname", values.nickname);
            formData.append("phone", values.phone);
            formData.append("email", values.email);
            formData.append("address", values.address);

            if (images.length > 0) {
                formData.append("file", images[0].file);
            } else if(isImageDeleted){
                formData.append("file",null);
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

    return (
        <FormWrap onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <ProfileImageUpload
                isImageDeleted={isImageDeleted}
                images={images}
                handleImageChange={handleImageChange}
                resetImages={resetImages}
                setIsImageDeleted={setIsImageDeleted}
            update={true}/>
            <FormFields formik={formik} handlePhoneChange={handlePhoneChange} isSignUp={"sign"} />
            <ValidationMessages formik={formik} /> {/* ValidationMessages에 formik 객체 전달 */}
        </FormWrap>
    );
}

export default RegisterForm;
