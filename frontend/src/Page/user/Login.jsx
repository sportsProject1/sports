import LoginForm from "./LoginForm";
import {Container, Title} from "../../styled/Common";


function Login() {

    return(
        <Container>
            <Title>로그인 페이지</Title>
            <LoginForm/>

        </Container>
    )
}

export default Login;