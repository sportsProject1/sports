import LoginForm from "./LoginForm";
import {Title} from "../../styled/Common";
import styled from "styled-components";

const Container = styled.div`
    width: 500px;
    margin: 5% auto; // 세로 가운데 정렬을 위해 약간 수정
    padding: 20px; // 내부 여백 추가
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff; // 배경색 변경
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; // 요소 간 간격 추가
`;

function Login() {

    return(
        <Container>
            <Title>로그인 페이지</Title>
            <LoginForm/>

        </Container>
    )
}

export default Login;