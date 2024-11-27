import React, {useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import useImageUploader from "../../../../hooks/useImageUploader";
import {putTokenData} from "../../../../Server/ApiService";
import ProfileImageUpload from "../ProfileImageUpload";
import FormFields from "../FormFields";
import {FormWrap} from "../../../../styled/user/UserStyled";

function UserUpdateForm({userData,onUpdate}){

    const {images,handleImageChange,resetImages} = useImageUploader(false);

    const postcodeRef = useRef(null);

    const [isImageDeleted, setIsImageDeleted] = useState(false); // 이미지 삭제 여부를 추적하는 상태 변수

    // 주소 검색 초기화
    useEffect(() => {
        const loadPostcodeScript = () => {
            const script = document.createElement("script");
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                postcodeRef.current = new window.daum.Postcode({
                    oncomplete: (data) => {
                        formik.setFieldValue("zipCode", data.zonecode);
                        formik.setFieldValue("roadAddress", data.roadAddress);
                    },
                });
            };
            document.body.appendChild(script);
        };

        loadPostcodeScript();
    }, []);

    const handleAddressSearch = () => {
        if (postcodeRef.current) {
            postcodeRef.current.open();
        }
    };

    useEffect(() => {
        if (userData) {
            const [zipcode, roadAddress, detailAddress] = userData.address.split(',').map(item => item.trim());
            formik.setValues({
                imgURL: userData.imgURL || '',
                username: userData.username || '',
                nickname: userData.nickname || '',
                phone: userData.phone || '',
                zipCode: zipcode || '',
                roadAddress: roadAddress || '',
                detailAddress: detailAddress || '',
                email: userData.email || '',
                file: '',
            });
        }
    }, [userData]);

    const formik = useFormik({
        initialValues: {
            imgURL:'',
            username:'',
            nickname:'',
            phone:'',
            address: "",
            zipCode: "",
            roadAddress: "",
            detailAddress: "",
            email:'',
            file:'',
        },
        validationSchema:Yup.object({
            // phone:Yup.string().required('전화번호를 입력하세요.').matches(/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/, '전화번호 형식이 유효하지 않습니다.'),
            // email:Yup.string().email("유효한 이메일을 입력하세요.").required("이메일을 입력하세요"),
            // address: Yup.string().required("주소를 입력하세요.")
        }),
        onSubmit: async (values) => {
            console.log(123)
            const formData = new FormData();
            formData.append("nickname", values.nickname);
            formData.append("phone", values.phone);
            formData.append("email", values.email);
            formData.append("address",
                `${values.zipCode}, ${values.roadAddress}, ${values.detailAddress}`
            );

            if (images.length > 0) {
                formData.append("file", images[0].file); // 새 이미지가 업로드된 경우
            } else if (isImageDeleted) {
                formData.append("file", null); // 기존 이미지가 삭제된 경우
            } else if (userData.imgURL) {
                formData.append("imgURL", userData.imgURL); // 기존 이미지를 유지하려는 경우
            }

            try{
                await putTokenData("/user/update",formData);
                onUpdate();
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
    };

    return (
        <FormWrap onSubmit={formik.handleSubmit} encType={"multipart/form-data"}>

            <ProfileImageUpload
                images={images}
                handleImageChange={handleImageChange}
                resetImages={resetImages}
                userData={userData}
                isImageDeleted={isImageDeleted}
                setIsImageDeleted={setIsImageDeleted}
                update={true}/>

            <FormFields handleAddressSearch={handleAddressSearch} onUpdate={onUpdate} formik={formik} handlePhoneChange={handlePhoneChange} isSignUp={"update"} disable={false} />

        </FormWrap>
    )
}

export default UserUpdateForm;