import styled from 'styled-components';
import { Title } from "../../styled/Common";

export const FormWrap = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 900px;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    > h1, > ${Title} {
            margin-bottom: 20px; /* 타이틀 아래 여백 */
            font-size: 1.5rem;
            text-align: center;
            color: #333; /* 제목 색상 */
        }
`;

export const ProfileImageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
    padding: 20px;
    text-align: center;

    img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 10px;
    }

    span {
        font-size: 12px;
        color: #888;
    }

    input[type="file"] {
        margin-top: 10px;
    }

    button {
        margin-top: 5px;
        padding: 5px 10px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
`;

export const FormFieldsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
    padding: 20px;

    label {
        display: flex;
        flex-direction: column;
        font-weight: bold;
        margin-bottom: 10px;

        input {
            margin-top: 5px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
        }

        div {
            color: red;
            font-size: 12px;
            margin-top: 3px;
        }
    }

    input[type="submit"] {
        margin-top: 20px;
        padding: 10px;
        font-weight: bold;
        color: white;
        background-color: #3498db;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
`;

export const ErrorFieldsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
    padding: 20px;
    
    div {
            font-size: 12px;
            margin-top: 25px;
        }
`;

export const InputWithError = styled.div`
    display: flex;
    align-items: center;

    input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
`;

export const PassMessage = styled.div`
    color:${props => props.theme.colors.secondary} !important;;
`;

export const ErrorMessage = styled.div`
    color:${props => props.theme.colors.error};
`


export const LoginFormWrap = styled.form`
    max-width: 400px;
    margin: 0 auto;
    > button{
        margin-top:15px;
    }
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