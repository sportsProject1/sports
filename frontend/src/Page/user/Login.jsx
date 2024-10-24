import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

const LoginContainer = styled.div`
    margin: auto;
    > form{}
    display: flex;
    flex-direction: column;
    width: 500px;
    padding: 15px;
    border: 1px solid black;
    >form >label{
        display: block;
        margin: 15px;
    }
`


function Login() {

    const [loginForm, setLoginForm] = useState({
        username:"",
        password:"",
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({...loginForm, [name]: value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response  = await axios.post("http://localhost:8090/login", loginForm);
            console.log("로그인 됨",response.data)
            navigate("/",{replace:true});
        }catch (err){
            console.log(err);
        }
    }

    return(
        <LoginContainer>
            <h1>로그인 페이지</h1>
            <form onSubmit={handleSubmit} action={"/member/login"} method={"POST"}>
                <label>
                    아이디
                    <input placeholder="아이디를 입력하세요."
                    onChange={handleChange}
                    name={"username"}
                    value={loginForm.username}
                    type={"text"}/>
                </label>

                <label>
                    비밀번호
                    <input placeholder="비밀번호를 입력하세요."
                    onChange={handleChange}
                    name={"password"}
                    value={loginForm.password}
                    type={"password"}/>
                </label>

                <Link to={"/register"}>회원가입</Link>
                <input type="submit" value="로그인"/>

            </form>
        </LoginContainer>
    )
}

export default Login;