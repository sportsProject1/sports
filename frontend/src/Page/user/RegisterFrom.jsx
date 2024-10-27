// RegisterForm.jsx
import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import useImageUploader from "../../hooks/useImageUploader";
import {postData} from "../../Server/ApiServiceNoToken";
import {RegisterFormWrap} from "../../styled/UserStyled";


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
            username: Yup.string().required('아이디를 입력하세요.'),
            password: Yup.string()
                .required('비밀번호를 입력하세요.')
                .min(3, '비밀번호는 최소 3자 이상이어야 합니다.'),
            nickname: Yup.string().required('이름을 입력하세요.'),
            // phone: Yup.string()
            //     .required('전화번호를 입력하세요.')
            //     .matches(/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/, '전화번호 형식이 유효하지 않습니다.'),
            email: Yup.string().email('유효한 이메일을 입력하세요.').required('이메일을 입력하세요.'),
            address: Yup.string().required('주소를 입력하세요.'),
        }),
        onSubmit: async (values) => {
            console.log("123123")
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
                await postData("register", formData);
                onSuccess(); // 성공 시 호출
            } catch (error) {
                console.error("회원가입 실패:", error);
            }
        },
    });

    return (
            <RegisterFormWrap onSubmit={formik.handleSubmit} encType="multipart/form-data">
                {images.length > 0 && (
                    <div>
                        <img src={images[0].preview} alt="#" />
                        <button type="button" onClick={resetImages}>이미지 삭제</button>
                    </div>
                )}
                <label htmlFor="file">
                    이미지 업로드
                    <input onChange={handleImageChange} name="file" type="file" />
                </label>
                <label>
                    아이디
                    <input
                        placeholder="아이디를 입력하세요."
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div>{formik.errors.username}</div>
                    ) : null}
                </label>
                <label>
                    비밀번호
                    <input
                        placeholder="비밀번호를 입력하세요."
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div>{formik.errors.password}</div>
                    ) : null}
                </label>
                <label>
                    이름
                    <input
                        placeholder="이름을 입력하세요."
                        name="nickname"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nickname}
                    />
                    {formik.touched.nickname && formik.errors.nickname ? (
                        <div>{formik.errors.nickname}</div>
                    ) : null}
                </label>
                <label>
                    전화번호
                    <input
                        placeholder="010-xxxx-xxxx"
                        name="phone"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                        <div>{formik.errors.phone}</div>
                    ) : null}
                </label>
                <label>
                    이메일
                    <input
                        placeholder="이메일을 입력하세요."
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div>{formik.errors.email}</div>
                    ) : null}
                </label>
                <label>
                    주소
                    <input
                        placeholder="주소를 입력하세요."
                        name="address"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                    />
                    {formik.touched.address && formik.errors.address ? (
                        <div>{formik.errors.address}</div>
                    ) : null}
                </label>
                <input type="submit" value="회원가입" />
            </RegisterFormWrap>
    );
}

export default RegisterForm;
