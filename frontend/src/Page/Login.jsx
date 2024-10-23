import styled from "styled-components";
import {Link} from "react-router-dom";

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
    return(
        <LoginContainer>
            <h1>로그인 페이지</h1>
            <form>
                <label>
                    아이디
                    <input placeholder="아이디를 입력하세요."/>
                </label>

                <label>
                    비밀번호
                    <input placeholder="비밀번호를 입력하세요."/>
                </label>

                <Link to={"/register"}>회원가입</Link>
                <input type="submit" value="로그인"/>

            </form>
        </LoginContainer>
    )
}

export default Login;