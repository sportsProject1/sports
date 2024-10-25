import {Link, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import React from "react";

function LoginForm() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('아이디를 입력하세요.'),
            password: Yup.string()
                .required('비밀번호를 입력하세요.')
                .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
        }),

        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("password", values.password);
            try {
                const response  = await axios.post("http://localhost:8090/login", formData);
                console.log("로그인 됨",response.data)
                navigate("/",{replace:true});
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
