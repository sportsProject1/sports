// ValidationMessages.jsx
import React from 'react';
import { ErrorFieldsWrapper, PassMessage, ErrorMessage } from "../../../styled/UserStyled";

function ValidationMessages({ formik,isAvailable }) {
    return (
        <ErrorFieldsWrapper>
            {formik.errors.username ? (
                <ErrorMessage>{formik.errors.username}</ErrorMessage>
            ) : formik.values.username.length >= 3 ? (
                isAvailable !== null && !isAvailable ? (
                    <ErrorMessage>이미 사용 중인 아이디입니다.</ErrorMessage>
                ) : (
                    <PassMessage>아이디의 길이가 일치합니다.</PassMessage>
                )
            ) : (
                <ErrorMessage>아이디의 길이가 맞지 않습니다.</ErrorMessage>
            )}

            {formik.errors.password ? (
                <ErrorMessage>{formik.errors.password}</ErrorMessage>
            ) : formik.values.password.length >= 8 ? ( // 최소 비밀번호 길이로 변경
                <PassMessage>비밀번호의 길이가 일치합니다.</PassMessage>
            ) : (
                <ErrorMessage>비밀번호의 길이가 맞지 않습니다.</ErrorMessage>
            )}

            {formik.errors.nickname ? (
                <ErrorMessage>{formik.errors.nickname}</ErrorMessage>
            ) : (
                <PassMessage>이름이 입력되었습니다.</PassMessage>
            )}

            {formik.errors.phone ? (
                <ErrorMessage>{formik.errors.phone}</ErrorMessage>
            ) : (
                <PassMessage>유효한 전화번호입니다.</PassMessage>
            )}

            {formik.errors.email ? (
                <ErrorMessage>{formik.errors.email}</ErrorMessage>
            ) : (
                <PassMessage>이메일이 유효합니다.</PassMessage>
            )}

            {formik.errors.address ? (
                <ErrorMessage>{formik.errors.address}</ErrorMessage>
            ) : (
                <PassMessage>주소가 입력되었습니다.</PassMessage>
            )}
        </ErrorFieldsWrapper>
    );
}

export default ValidationMessages;
