import styled from "styled-components";

export const RegisterFormWrap = styled.form`
    width: 50%;
    margin: auto;
    display: flex;
    flex-direction: column;
    >div{ //숨겨진 이미지 박스 div
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    >div>button{ // 이미지 박스 삭제버튼
        margin-top:15px;
    }
    >div>img{ // 이미지 박스 이미지
        width: 200px;
        height: 200px;
        border-radius: 50%;
    }
    >label{ // 각 인풋 감싸는 label
        display: flex;
        flex-direction: column;
        margin:10px 0;
    }
    >label >input{ // label 안에 input
        padding:30px;
    }
    >label > div{ // label 안에 있는 유효성검사 
        color:red;
        margin-top:10px;
    }
    
    >input{
        width: 100px;
        height: 50px;
        border-radius: 15px;
        margin: auto;
    }
`

export const LoginFormWrap = styled.form`
    
`