import {Link, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import React from "react";
import {useDispatch} from "react-redux";
import {setCredentials} from "../../Store/authSlice";
import {jwtDecode} from "jwt-decode";

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
                const token = response.data.token; // 토큰 빼오기
                const user = token? jwtDecode(token) :null // 로그인시 리덕스에 디코드된 토큰값 저장
                dispatch(setCredentials({ user,token })); // 비구조할당으로 가져온 데이터 리덕스툴킷 스토어에 저장함 (리액트 모든 페이지에서 전역으로 사용가능)

                localStorage.setItem("token", token); // 토큰값 로컬스토리지로 관리

                navigate("/",{replace:true}); // 메인페이지로 이동 및 뒤로가기 잠금
            }catch (err){
                console.log(err);
            }
        },
    });

    return(
        <form onSubmit={formik.handleSubmit} action={"/login"} method={"POST"}>
            <label>
                아이디
                <input placeholder="아이디를 입력하세요."
                       name={"username"}
                       onChange={formik.handleChange}
                       value={formik.values.username}
                       onBlur={formik.handleBlur}
                       type={"text"}/>

                {formik.touched.username && formik.errors.username ? (
                    <div>{formik.errors.username}</div>
                ) : null}
            </label>

            <label>
                비밀번호
                <input placeholder="비밀번호를 입력하세요."
                       name={"password"}
                       onChange={formik.handleChange}
                       value={formik.values.password}
                       onBlur={formik.handleBlur}
                       type={"password"}/>

                {formik.touched.username && formik.errors.username ? (
                    <div>{formik.errors.username}</div>
                ) : null}
            </label>

            <Link to={"/register"}>회원가입</Link>
            <input type="submit" value="로그인"/>

        </form>
    )
}

export default LoginForm;
