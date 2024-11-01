// RegisterForm.jsx
import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import useImageUploader from "../../hooks/useImageUploader";
import {postData} from "../../Server/ApiServiceNoToken";
import {
    ErrorFieldsWrapper, ErrorMessage,
    FormFieldsWrapper,
    PassMessage,
    ProfileImageWrapper,
    RegisterFormWrap
} from "../../styled/UserStyled";

function RegisterForm({ onSuccess }) {
    const { images, handleImageChange, resetImages } = useImageUploader(false);



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
            username: Yup.string().required('아이디는 6~20자 사이여야 합니다.').min(3, '아이디는 최소 6자 이상이어야 합니다.'),
            password: Yup.string()
                .required('비밀번호를 입력하세요.')
                .min(8, '비밀번호는 최소 8자 이상 영어와 숫자를 섞어주세요.'),
            nickname: Yup.string().required('이름을 입력하세요.').min(2,"이름은 최소 두 글자 이상이어야 합니다."),
            phone: Yup.string()
                .matches(/^\d{3}-\d{4}-\d{4}$/, '형식이 올바르지 않습니다 (예: 010-1234-5678).')
                .required('전화번호를 입력하세요.'),
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
            }

            try {
                await postData("/register", formData);
                onSuccess(); // 성공 시 호출
            } catch (error) {
                console.error("회원가입 실패:", error);
            }
        },
    });

    const handlePhoneChange = (e, setFieldValue) => {
        const input = e.target.value.replace(/\D/g, ''); // 숫자 외의 모든 문자 제거
        const formattedInput = input.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3'); // 하이픈 추가
        setFieldValue('phoneNumber', formattedInput);
    };

    return (
        <RegisterFormWrap onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <ProfileImageWrapper>
                {images.length > 0 ? (
                    <img src={images[0].preview} alt="프로필 이미지 미리보기" />
                ) : (
                    <span>프로필 이미지를 선택하세요</span>
                )}
                <input type="file" name="file" onChange={handleImageChange} />
                {images.length > 0 && <button type="button" onClick={resetImages}>삭제</button>}
            </ProfileImageWrapper>

            <FormFieldsWrapper>
                <label>
                    아이디
                    <input
                        placeholder="아이디를 입력하세요."
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />

                </label>

                <label>
                    비밀번호
                    <input
                        placeholder="비밀번호를 입력하세요."
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />

                </label>

                <label>
                    이름
                    <input
                        placeholder="이름을 입력하세요."
                        name="nickname"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.nickname}
                    />

                </label>

                <label>
                    전화번호
                    <input
                        placeholder="010-xxxx-xxxx"
                        name="phone"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.phone}

                    />
                    {/* 전화번호 유효성 검사는 추가로 구현 가능합니다. */}
                </label>

                <label>
                    이메일
                    <input
                        placeholder="이메일을 입력하세요."
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />

                </label>

                <label>
                    주소
                    <input
                        placeholder="주소를 입력하세요."
                        name="address"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.address}
                    />

                </label>

                <button type="submit">회원가입</button>
            </FormFieldsWrapper>

            <ErrorFieldsWrapper>

                {formik.errors.username ? (
                    <div>{formik.errors.username}</div>
                ) : formik.values.username.length >= 3 ? (
                    <PassMessage>아이디의 길이가 일치합니다.</PassMessage>
                ) : (
                    <ErrorMessage>아이디의 길이가 맞지 않습니다.</ErrorMessage>
                )}

                {formik.errors.password ? (
                    <div>{formik.errors.password}</div>
                ) : formik.values.password.length >= 3 ? (
                    <PassMessage>비밀번호의 길이가 일치합니다.</PassMessage>
                ) : (
                    <ErrorMessage>비밀번호의 길이가 맞지 않습니다.</ErrorMessage>
                )}

                {formik.errors.nickname ? (
                    <div>{formik.errors.nickname}</div>
                ) : (
                    <PassMessage>이름이 입력되었습니다.</PassMessage>
                )}

                {formik.errors.phone ? (
                    <div>{formik.errors.phone}</div>
                ) : (
                    <PassMessage>번호맞네</PassMessage>
                )}

                {formik.errors.email ? (
                    <div>{formik.errors.email}</div>
                ) : (
                    <PassMessage>이메일이 유효합니다.</PassMessage>
                )}

                {formik.errors.address ? (
                    <div>{formik.errors.address}</div>
                ) : (
                    <PassMessage>주소가 입력되었습니다.</PassMessage>
                )}

            </ErrorFieldsWrapper>
        </RegisterFormWrap>
    );
}

export default RegisterForm;
