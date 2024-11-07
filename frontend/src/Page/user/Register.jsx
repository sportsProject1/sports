import {useNavigate} from "react-router-dom";
import {useState} from "react";
import useImageUploader from "../../hooks/useImageUploader";
import {postData} from "../../Server/ApiServiceNoToken";
import RegisterForm from "./RegisterFrom";
import {Title} from "../../styled/Common";


function Register() {

    const navigate = useNavigate();

    const {images,handleImageChange,resetImages} = useImageUploader(false)
    return (
        <div>
            <Title>회원가입 페이지</Title>
            <RegisterForm onSuccess={() => navigate("/")}/>
        </div>
    )
}

export default Register