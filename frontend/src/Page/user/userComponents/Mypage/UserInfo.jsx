import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import useImageUploader from "../../../../hooks/useImageUploader";
import {putTokenData} from "../../../../Server/ApiService";
import ProfileImageUpload from "../ProfileImageUpload";
import FormFields from "../FormFields";
import {FormWrap} from "../../../../styled/user/UserStyled";
import { Title } from "../../../../styled/Common";

function UserInfo({userData,onUpdate}){

    const {images,handleImageChange,resetImages} = useImageUploader(false);

    const [isImageDeleted, setIsImageDeleted] = useState(false); // 이미지 삭제 여부를 추적하는 상태 변수

//     useEffect(() => {
//         if (userData) {
//             formik.setValues({
//                 imgURL: userData.imgURL || '',
//                 username: userData.username || '',
//                 nickname: userData.nickname || '',
//                 phone: userData.phone || '',
//                 address: userData.address || '',
//                 email: userData.email || '',
//                 file: '',
//             });
//         }
//     }, [userData]);

    const formik = useFormik({
        // userData를 기반으로 초기값 설정
        initialValues: {
            imgURL: userData?.imgURL || '',
            username: userData?.username || '',
            nickname: userData?.nickname || '',
            phone: userData?.phone || '',
            address: userData?.address || '',
            email: userData?.email || '',
            file: '',
        },
        enableReinitialize: true, // userData 변경 시 초기값 재설정
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
                await putTokenData("/user/update",formData);
            }catch(error){
                console.error(error)
            }

        }
    })

    const formatPhoneNumber = (value) => {
        const onlyNumbers = value.replace(/\D/g, "");
        if (onlyNumbers.length <= 3) return onlyNumbers;
        if (onlyNumbers.length <= 7) return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
        return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
    };

    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        formik.setFieldValue("phone", formattedPhone);
        formik.validateField("phone"); // 유효성 검사 강제 실행
    };

    return (
        <FormWrap>
            <Title>마이페이지</Title>

            <ProfileImageUpload
                images={images}
                handleImageChange={handleImageChange}
                resetImages={resetImages}
                userData={userData}
                isImageDeleted={isImageDeleted}
                setIsImageDeleted={setIsImageDeleted}
                update={false}/>

            <FormFields
                formik={formik}
                handlePhoneChange={handlePhoneChange}
                isSignUp={"info"} disable={true}
                onUpdate={onUpdate}/>

        </FormWrap>
    )
}

export default UserInfo;