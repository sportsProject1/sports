import {Link, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {useState} from "react";
import axios from "axios";
import useImageUploader from "../../hooks/useImageUploader";
import {postData} from "../../Server/ApiService";
import {handleChange} from "../../Utils/handleChange";
import RegisterForm from "./RegisterFrom";


function Register() {

    const [registerForm, setRegisterForm] = useState({
        username:"",
        password:"",
        nickname:"",
        phone:"",
        email:"",
        address:"",
        file:""

    })
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        //submit 이벤트
        const formData = new FormData();
        formData.append("username", registerForm.username);
        formData.append("password", registerForm.password);
        formData.append("nickname", registerForm.nickname);
        formData.append("phone", registerForm.phone);
        formData.append("email", registerForm.email);
        formData.append("address", registerForm.address);
        // 백엔드로 데이터 넘겨줄 때 formData에 추가해주기 위한 코드
        // 이미지 파일이 있으면 FormData에 추가
        if (images.length > 0) {
            formData.append("file", images[0].file);
        }

        postData("register", formData)
            .then(res=> navigate("/"))
            .catch()

    }
    const {images,handleImageChange,resetImages} = useImageUploader(false)
    return (
        <div>
            <h1>회원가입 페이지</h1>
            <RegisterForm/>
        </div>
    )
}

export default Register