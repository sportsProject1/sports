import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useImageUploader from "../../hooks/useImageUploader";
import { FormWrap } from "../../styled/user/UserStyled";
import { Title } from "../../styled/Common";
import { postData, registerFetchData } from "../../Server/ApiServiceNoToken";
import ProfileImageUpload from "./userComponents/ProfileImageUpload";
import FormFields from "./userComponents/FormFields";

function RegisterForm({ onSuccess }) {
    const { images, handleImageChange, resetImages } = useImageUploader(false);
    const [isImageDeleted, setIsImageDeleted] = useState(false);

    const postcodeRef = useRef(null);

    // 전화번호 포맷팅 함수
    const formatPhoneNumber = (value) => {
        const onlyNumbers = value.replace(/\D/g, "");
        if (onlyNumbers.length <= 3) return onlyNumbers;
        if (onlyNumbers.length <= 7) return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
        return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
    };

    // 주소 검색 초기화
    useEffect(() => {
        const loadPostcodeScript = () => {
            const script = document.createElement("script");
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                postcodeRef.current = new window.daum.Postcode({
                    oncomplete: (data) => {
                        formik.setFieldValue("zipCode", data.zonecode);
                        formik.setFieldValue("roadAddress", data.roadAddress);
                    },
                });
            };
            document.body.appendChild(script);
        };

        loadPostcodeScript();
    }, []);

    // Formik 설정
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            nickname: "",
            phone: "",
            email: "",
            address: "",
            zipCode: "",
            roadAddress: "",
            detailAddress: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, "아이디는 최소 6자 이상이어야 합니다.")
                .required("아이디는 6~20자 사이여야 합니다.")
                .test("check-username", "이미 사용 중인 아이디입니다.", async (value) => {
                    if (!value) return false;
                    try {
                        const response = await registerFetchData("/oauth2/check-username", {
                            params: { username: value },
                        });
                        return !response.data.isDuplicate;
                    } catch (error) {
                        console.error("아이디 중복 확인 오류:", error);
                        return false;
                    }
                }),
            password: Yup.string()
                .min(8, "비밀번호는 최소 8자 이상 영어와 숫자를 섞어주세요.")
                .required("비밀번호를 입력하세요."),
            nickname: Yup.string()
                .min(2, "이름은 최소 두 글자 이상이어야 합니다.")
                .required("이름을 입력하세요."),
            phone: Yup.string()
                .matches(/^\d{3}-\d{4}-\d{4}$/, "형식이 올바르지 않습니다 (예: 010-1234-5678).")
                .required("전화번호를 입력하세요."),
            email: Yup.string()
                .email("유효한 이메일을 입력하세요.")
                .required("이메일을 입력하세요."),
            detailAddress: Yup.string().required("상세주소를 입력하세요."),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("password", values.password);
            formData.append("nickname", values.nickname);
            formData.append("email", values.email);
            formData.append("phone", values.phone);
            formData.append(
                "address",
                `${values.zipCode}, ${values.roadAddress}, ${values.detailAddress}`
            );

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
        if (postcodeRef.current) {
            postcodeRef.current.open();
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
        </FormWrap>
    );
}

export default RegisterForm;
