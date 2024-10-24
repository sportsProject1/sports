import {Link} from "react-router-dom";
import styled from "styled-components";
import {useState} from "react";
import axios from "axios";
import useImageUploader from "../../hooks/useImageUploader";

const RegisterContainer = styled.div`
    display: flex;
    justify-content: center;
    > form{
        display: flex;
        flex-direction: column;
        width: 500px;
        padding: 15px;
        border: 1px solid black;
        justify-content: center;
        align-items: center;
        div >img{
            width: 300px;
            height: 300px;
            border-radius: 50%;
        }
    }
    
    >form >label{
        display: block;
        margin: 15px;
    }
`

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm({...registerForm, [name]: value});
        // name값이 일치한 input 데이터 수정
    }
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

        try {
            const response  = await axios.post("http://localhost:8090/register", formData,{
                // 기존에 registerForm을 보냈던 데이터 formData로 변경
                headers: {
                    "Content-Type": "multipart/form-data"
                    // content-Type 멀티파트 폼데이터로 변경
                }
            });
            console.log("회원가입성공",response)
        }catch (error) {
            console.log(error);
        }
    }
    const {images,handleImageChange,resetImages} = useImageUploader(false)
    return (
        <RegisterContainer>
            <h1>회원가입 페이지</h1>
            <form onSubmit={handleSubmit} action={"/register"} method={"POST"} encType={"multipart/form-data"}>

                {images.length > 0 &&(
                    <div>
                        <img src={images[0].preview} alt="#"/>
                        <button onClick={resetImages}>이미지 삭제</button>
                    </div>
                )}

                <label id={"file"}>
                    이미지 업로드
                    <input onChange={handleImageChange} name={"file"} type={"file"}/>
                </label>
                <label>
                    아이디
                    <input placeholder="아이디를 입력하세요."
                           onChange={handleChange}
                           name={"username"}
                           type={"text"}
                           value={registerForm.username}/>
                </label>

                <label>
                    비밀번호
                    <input placeholder="비밀번호를 입력하세요."
                           onChange={handleChange}
                           name={"password"}
                           type={"password"}
                           value={registerForm.password}/>
                </label>

                <label>
                    이름
                    <input placeholder="이름을 입력하세요."
                           onChange={handleChange}
                           type={"text"}
                           name={"nickname"}
                           value={registerForm.nickname}/>
                </label>

                <label>
                    전화번호
                    <input placeholder="010-xxxx-xxxx"
                           onChange={handleChange}
                           type={"text"}
                           name={"phone"}
                           value={registerForm.phone}/>
                </label>

                <label>
                    이메일
                    <input placeholder="이메일을 입력하세요."
                           onChange={handleChange}
                           name={"email"}
                           type={"email"}
                           value={registerForm.email}/>
                </label>

                <label>
                    주소
                    <input placeholder="주소를 입력하세요."
                           onChange={handleChange}
                           type={"text"}
                           name={"address"}
                           value={registerForm.address}/>
                </label>

                <Link to={"/login"}>로그인 하러가기</Link>
                <input type="submit" value="회원가입"/>

            </form>
        </RegisterContainer>
    )
}

export default Register