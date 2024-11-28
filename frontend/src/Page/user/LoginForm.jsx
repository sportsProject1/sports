import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../Store/authSlice";
import { Button, Input } from "../../styled/Common";
import { ErrorText, InputGroup, Label, LoginFormWrap } from "../../styled/user/UserStyled";
import {postData, postJsonData} from "../../Server/ApiServiceNoToken";
import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { SiKakao } from "react-icons/si";

export const RegisterLink = styled(Link)`
    position: relative;
    display:block;
    margin-left:auto;
    margin-bottom: 15px;
`;

export const LoginButton = styled.button`
    width: 100%;
    padding: 1rem;
    background-color: #4285F4;
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 0.5rem;
    transition: 0.3s ease;
`;

export const SocialBox = styled.div`
    width: 80%;
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 0.5rem;
    transition: 0.3s ease;
    margin:auto;
    margin-top:15px;
    display:flex;
    justify-content:center;
    gap: 20%;
`;

export const SocialButton = styled.button`
    width: 32%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius || "8px"};
    cursor: pointer;
    background-color: ${({ color }) => color || "#ffffff"};

    &:hover {
        opacity: 0.9;
    }
`;

// export const GoogleButton = styled(SocialButton)`
//     background-color: #db4437; // Google 색상
//     color: white;
// `;
//
// export const KakaoButton = styled(SocialButton)`
//     background-color: #fee500; // Kakao 색상
//     color: black;
// `;


function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 로컬스토리지 저장 함수
    const saveLoginDataToLocalStorage = ({ token, refreshToken, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("loginTime", new Date().getTime()); // 로그인 시간 저장
    };

    // Formik 설정
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("아이디를 입력하세요."),
            password: Yup.string()
                .required("비밀번호를 입력하세요.")
                .min(3, "비밀번호는 최소 3자 이상이어야 합니다."),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("password", values.password);

            try {
                const res = await postJsonData("/login", formData);
                const { accessToken: token, refreshToken, nickname, role, username, userId, imgURL } = res;

                const user = { nickname, role, username, userId, imgURL };

                dispatch(setCredentials({ user, token })); // Redux에 저장
                saveLoginDataToLocalStorage({ token, refreshToken, user });

                navigate("/", { replace: true }); // 메인 페이지로 이동 및 뒤로가기 잠금
            } catch (err) {
                console.error("로그인 오류:", err);
            }
        },
    });

    // 소셜 로그인 핸들러
    const handleSocialLogin = (platform) => {
        const url = `https://sports-5ebw.onrender.com/oauth2/authorization/${platform}`;
        window.location.href = url;
    };

    return (
        <LoginFormWrap onSubmit={formik.handleSubmit}>
            {/* 아이디 입력 */}
            <InputGroup>
                <Label>
                    아이디
                    <Input
                        placeholder="아이디를 입력하세요."
                        name="username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        onBlur={formik.handleBlur}
                        type="text"
                    />
                    {formik.touched.username && formik.errors.username && (
                        <ErrorText>{formik.errors.username}</ErrorText>
                    )}
                </Label>
            </InputGroup>

            {/* 비밀번호 입력 */}
            <InputGroup>
                <Label>
                    비밀번호
                    <Input
                        placeholder="비밀번호를 입력하세요."
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        type="password"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <ErrorText>{formik.errors.password}</ErrorText>
                    )}
                </Label>
            </InputGroup>

            {/* 회원가입 및 버튼 */}
            <RegisterLink to="/register">▶ 회원가입 하러가기</RegisterLink>
            <LoginButton type="submit">로그인</LoginButton>
            <SocialBox>
                <SocialButton>
                    <FcGoogle size={50} onClick={() => handleSocialLogin("google")}/>
                </SocialButton>
                <SocialButton>
                    <SiKakao size={70} onClick={() => handleSocialLogin("kakao")}/>
                </SocialButton>
            </SocialBox>
        </LoginFormWrap>
    );
}

export default LoginForm;
