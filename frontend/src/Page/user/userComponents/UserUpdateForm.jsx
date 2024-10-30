import React, {useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import useImageUploader from "../../../hooks/useImageUploader";
import {postTokenData} from "../../../Server/ApiService";
import {useSelector} from "react-redux";
import {FormWrap, UserForm} from "../../../styled/Form";

function UserUpdateForm({user}){

    const {images,handleImageChange,resetImages} = useImageUploader(false);

    const [isImageDeleted, setIsImageDeleted] = useState(false); // 이미지 삭제 여부를 추적하는 상태 변수


    const token = useSelector((state) => state.auth.token);

    const formik = useFormik({
        initialValues: {
            imgURL:user.imgURL,
            username:user.username,
            nickname:user.nickname,
            phone:user.phone,
            address:user.address,
            email:user.email,
            file:'',
        },
        validationSchema:Yup.object({
            phone:Yup.string().required('전화번호를 입력하세요.').matches(/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/, '전화번호 형식이 유효하지 않습니다.'),
            email:Yup.string().email("유효한 이메일을 입력하세요.").required("이메일을 입력하세요"),
            address: Yup.string().required("주소를 입력하세요.")
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("nickname", values.nickname);
            formData.append("phone", values.phone);
            formData.append("email", values.email);
            formData.append("address", values.address);

            if (images.length > 0) {
                formData.append("file", images[0].file); // 새 이미지가 업로드된 경우
            } else if (isImageDeleted) {
                formData.append("file", null); // 기존 이미지가 삭제된 경우
            }
            try{
                await postTokenData("user/update",formData,token);
            }catch(error){
                console.error(error)
            }

        }
    })

    return (
        <FormWrap>
        <UserForm>
            <div>
                {images.length > 0 ? (
                    <img src={images[0].preview} alt="#"/>

                ) : isImageDeleted ? (
                    <img src="https://mystudy5350.s3.amazonaws.com/test/222.jfif" alt="삭제된 이미지"/>
                ) : (
                    <img src={user.imgURL} alt="기존 프로필 이미지"/>
                )}

                <label id={"profileImg"}>프로필 사진 변경
                    <input style={{display: "none"}} name={"profileImg"} type={"file"}/>
                </label>

                <button type="button" onClick={() => {
                    resetImages(); // 이미지 삭제
                    setIsImageDeleted(true); // 이미지 삭제 상태 업데이트
                }}>
                    이미지 삭제
                </button>
            </div>


            <div>
                <label>
                    아이디
                    <input onChange={formik.handleChange} name={"username"} value={formik.values.username}/>
                </label>
                <label>
                    이름
                <input onChange={formik.handleChange} name={"nickname"} value={formik.values.nickname}/>
                </label>
                <label>
                    핸드폰 번호
                <input onChange={formik.handleChange} name={"phone"} value={formik.values.phone}/>
                </label>
                <label>
                주소
                <input onChange={formik.handleChange} name={"address"} value={formik.values.address}/>
                </label>
                <label>
                이메일
                <input onChange={formik.handleChange} name={"email"} value={formik.values.email}/>
                </label>

                <input type={"submit"} value={"프로필 수정"}/>
            </div>
        </UserForm>
        </FormWrap>
    )
}

export default UserUpdateForm;