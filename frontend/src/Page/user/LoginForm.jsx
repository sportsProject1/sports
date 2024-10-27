import {Link, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {fetchData, postData} from "../../Server/ApiService";

function LoginForm() {
    const navigate = useNavigate();

    const [userData,setUserData] = useState();

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
                // const response  = await axios.post("http://localhost:8090/login", formData);
                // console.log("로그인 됨",response.data)
                const response = await postData("user/login",formData) // post요청 user/login (로그인 시 jwt토큰 넘어옴)
                const token = response.token;
                setUserData(token)

                // await fetchData("userinfo",setUserData); // get요청 userinfo로 보냄 (일단 무시)
                // navigate("/",{replace:true});
            }catch (err){
                console.log(err);
            }
        },
    });
    console.log(userData)

    return(
        <form onSubmit={formik.handleSubmit} action={"/login"} method={"POST"}>
            <button onClick={()=>console.log(userData)}>
                임시 유저 JWT 데이터 받아와지는지 확인
            </button>
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
