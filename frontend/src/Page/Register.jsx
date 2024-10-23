import {Link} from "react-router-dom";
import styled from "styled-components";

const RegisterContainer = styled.div`
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

function Register() {
    return(
        <RegisterContainer>
            <h1>로그인 페이지</h1>
            <form action={"/register"} method={"POST"}>
                <label>
                    아이디
                    <input placeholder="아이디를 입력하세요."/>
                </label>

                <label>
                    비밀번호
                    <input placeholder="비밀번호를 입력하세요."/>
                </label>

                <label>
                    이름
                    <input placeholder="이름을 입력하세요."/>
                </label>

                <label>
                    전화번호
                    <input placeholder="010-xxxx-xxxx"/>
                </label>

                <label>
                    이메일
                    <input placeholder="user@user.com"/>
                </label>

                <label>
                    주소
                    <input placeholder="OO시OO구"/>
                </label>

                <Link to={"/login"}>로그인 하러가기</Link>
                <input type="submit" value="로그인"/>

            </form>
        </RegisterContainer>
    )
}
export default Register