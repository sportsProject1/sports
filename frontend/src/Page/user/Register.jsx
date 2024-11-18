import {useNavigate} from "react-router-dom";
import {useState} from "react";
import useImageUploader from "../../hooks/useImageUploader";
import {postData} from "../../Server/ApiServiceNoToken";
import RegisterForm from "./RegisterFrom";


function Register() {

    const navigate = useNavigate();

    const {images,handleImageChange,resetImages} = useImageUploader(false)
    return (
        <div>
            <RegisterForm onSuccess={() => navigate("/")}/>
        </div>
    )
}

export default Register