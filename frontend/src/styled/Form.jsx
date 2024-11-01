import styled from "styled-components";

export const Form = styled.form`
    width: 50%;
    margin: auto;
    display: flex;
    flex-direction: column;
    >input,select{
        padding:15px;
        margin:15px 0;
    }
`

export const DetailForm = styled.form`
    width: 100%;
    
`

export const FormWrap = styled.div`
    width: 50%;
    margin:auto;
    border:1px solid black;
    display: flex;
    box-sizing: border-box;
`

export const UserForm = styled.form`
    display: flex;
    margin: auto;
    padding: 20px;
    width: 100%;
    >div{
        width:50%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    img{
        width: 150px;
        height: 150px;
        border-radius: 50%;
    }
    > button{
        width: 100px;
        padding:10px;
        margin: auto;
    }
    >#profileImg{
        text-align: center;
        margin: 10px 0px;
    }
    div >label{
        display: flex;
        flex-direction: column;
    }
    input {
        padding: 10px;
        margin:5px;
    }
`

export const LoginFormWrap = styled.form`
    max-width: 400px;
    margin: 0 auto;
`

export const InputGroup = styled.div`
    width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`
export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text};
`

export const ErrorText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xsmall};
  line-height: 1.4;
`;