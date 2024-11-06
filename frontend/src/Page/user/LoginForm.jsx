import {Link, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import React from "react";
import {useDispatch} from "react-redux";
import {setCredentials} from "../../Store/authSlice";
import {Button, GoogleLogin, Input, KakaoLogin} from "../../styled/Common";
import {ErrorText, InputGroup, Label, LoginFormWrap} from "../../styled/UserStyled";

function LoginForm() {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('아이디를 입력하세요.'),
            password: Yup.string()
                .required('비밀번호를 입력하세요.')
                .min(3, '비밀번호는 최소 3자 이상이어야 합니다.'),
        }),

        onSubmit: async (values) => {
            console.log("login")
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("password", values.password);
            try {
                const response  = await axios.post("http://localhost:8090/login", formData);
//                 console.log("로그인 됨",response.data) // 토큰값 또는 data가 제대로 넘어오는지 콘솔로 확인
//                 const { user, token } = response.data; // response axios post요청으로 login시 response.data 내에 user와 token 비구조할당으로 가져옴
                console.log(response,"로긴")
                const token = response.data.accessToken; // 토큰 빼오기
                const refreshToken = response.data.refreshToken;
                const loginTime = new Date().getTime(); // 로그인 한 시점 시간 저장
                const user = {
                    nickname : response.data.nickname,
                    role: response.data.role,
                    username:response.data.username,
                }
                dispatch(setCredentials({ user,token })); // 비구조할당으로 가져온 데이터 리덕스툴킷 스토어에 저장함 (리액트 모든 페이지에서 전역으로 사용가능)

                localStorage.setItem("token", token); // 토큰값 로컬스토리지로 관리
                localStorage.setItem("refreshToken",refreshToken);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("loginTime",loginTime);

                navigate("/",{replace:true}); // 메인페이지로 이동 및 뒤로가기 잠금
            }catch (err){
                console.log(err);
            }
        },
    });

    const onKakao = () =>{
        window.location.href = 'http://localhost:8090/oauth2/authorization/kakao';
    }
    const onGoogle = () =>{
        window.location.href = 'http://localhost:8090/oauth2/authorization/google';
    }


    return(
        <LoginFormWrap onSubmit={formik.handleSubmit} action={"/login"} method={"POST"}>
            <InputGroup>
            <Label>
                아이디
                <Input placeholder="아이디를 입력하세요."
                       name={"username"}
                       onChange={formik.handleChange}
                       value={formik.values.username}
                       onBlur={formik.handleBlur}
                       type={"text"}/>

                {formik.touched.username && formik.errors.username ? (
                    <ErrorText>{formik.errors.username}</ErrorText>
                ) : null}
            </Label>
            </InputGroup>

            <InputGroup>
            <Label>
                비밀번호
                <Input placeholder="비밀번호를 입력하세요."
                       name={"password"}
                       onChange={formik.handleChange}
                       value={formik.values.password}
                       onBlur={formik.handleBlur}
                       type={"password"}/>

                {formik.touched.password && formik.errors.password ? (
                    <ErrorText>{formik.errors.password}</ErrorText>
                ) : null}
            </Label>
            </InputGroup>

            <Link to={"/register"}>회원가입</Link>
            <Button type="submit">로그인</Button>
            <GoogleLogin onClick={onGoogle} type="button">구글 로그인</GoogleLogin>
            <KakaoLogin onClick={onKakao} type="button">카카오 로그인</KakaoLogin>

        </LoginFormWrap>
    )
}

export default LoginForm;
