import styled from "styled-components";

export const UserForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 500px;
    border:1px solid black;
    margin: auto;
    padding: 20px;
    img{
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: auto;
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
    >label{
        display: flex;
        flex-direction: column;
    }
    input {
        padding: 10px;
        margin:5px;
    }
`