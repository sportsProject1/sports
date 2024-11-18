// FormFields.jsx
import React from 'react';
import { FormFieldsWrapper, InputWithError, ErrorText, PassMessage } from "../../../styled/user/UserStyled";
import styled from "styled-components";

const ZipCodeWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;
    input {
        flex: 1;
    }

    button {
        flex: 0 0 30%;
        border: none;
        color: white;
        background-color: ${({ theme }) => theme.colors.primary};
        padding: 10px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: ${({ theme }) => theme.colors.secondary};
        }
    }
    `;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
`;

const RegisterButton = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;

    button {
        width: 100%;
        padding: 12px;
        border: none;
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: ${({ theme }) => theme.colors.secondary};
        }
    }
`;

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

                    {/* zipCode 필드와 주소 검색 버튼을 한 줄로 배치 */}
                    {field === "zipCode" ? (
                        <ZipCodeWrapper>
                            <InputWithError>
                                <input
                                    placeholder="우편번호를 입력하세요."
                                    name={field}
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values[field]}
                                    readOnly
                                />
                            </InputWithError>
                            <button type="button" onClick={handleAddressSearch}>
                                주소 검색
                            </button>
                        </ZipCodeWrapper>
                    ) : (
                        <InputWithError>
                            <input
                                placeholder={`${field}를 입력하세요.`}
                                name={field}
                                type={field === "password" ? "password" : "text"}
                                onChange={field === "phone" ? handlePhoneChange : formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values[field]}
                                disabled={disable}
                                readOnly={field === "roadAddress"}
                            />
                        </InputWithError>
                    )}

                    {formik.touched[field] && (
                        <>
                            {formik.errors[field] ? (
                                <ErrorText>{formik.errors[field]}</ErrorText>
                            ) : (
                                <PassMessage>{`${field}의 길이가 일치합니다.`}</PassMessage>
                            )}
                        </>
                    )}
                </label>
            ))}

            {isSignUp === "sign" ? (
                <RegisterButton>
                    <button type="submit">회원가입</button>
                </RegisterButton>
            ) : isSignUp === "update" ? (
                <ButtonContainer>
                    <button type="submit">변경하기</button>
                    <button onClick={onUpdate} type="button">취소하기</button>
                </ButtonContainer>
            ) : isSignUp === "info" ? (
                <ButtonContainer>
                    <button onClick={onUpdate} type="button">수정하기</button>
                </ButtonContainer>
            ) : null}

        </FormFieldsWrapper>
    );
}

export default FormFields;
