// FormFields.jsx
import React from 'react';
import { FormFieldsWrapper } from "../../../styled/UserStyled";

function FormFields({ formik, handlePhoneChange,isSignUp,disable,onUpdate,handleAddressSearch }) {
    const fields =
        isSignUp === "sign"
            ? ["username", "password", "nickname", "phone", "email","zipCode","roadAddress", "detailAddress"]
            : isSignUp === "update"
                ? ["nickname", "phone", "email", "address"]
                : ["username", "password", "nickname", "phone", "email", "address"];
    return (
        <FormFieldsWrapper>



            {fields.map((field) => (
                <label key={field}>
                    {field === "username" && "아이디"}
                    {field === "password" && "비밀번호"}
                    {field === "nickname" && "이름"}
                    {field === "phone" && "전화번호"}
                    {field === "email" && "이메일"}
                    {field === "zipCode" && "주소"}
                    <input
                        placeholder={`${field}를 입력하세요.`}
                        name={field}
                        type={field === "password" ? "password" : "text"}
                        onChange={field === "phone" ? handlePhoneChange : formik.handleChange}
                        onBlur={formik.handleBlur} // 추가된 부분
                        value={formik.values[field]}
                        disabled={disable}
                        readOnly={field === "roadAddress" || field === "zipCode"}
                    />
                </label>
            ))}
            {isSignUp === "sign" ? (
                <>
                <button type={"button"} onClick={handleAddressSearch}>주소 검색</button>
                <button type="submit">회원가입</button>
                </>
            ) : isSignUp === "update" ? (
                <div>
                    <button type="submit">변경하기</button>
                    <button onClick={onUpdate} type="button">취소하기</button>
                </div>
            ) : isSignUp === "info" ? (
                <button onClick={onUpdate} type="button">수정하기</button>
            ) : null}

        </FormFieldsWrapper>
    );
}

export default FormFields;
