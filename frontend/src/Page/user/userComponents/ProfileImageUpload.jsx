// ProfileImageUpload.jsx
import React from 'react';
import {ProfileImageWrapper} from "../../../styled/user/UserStyled";
import styled from 'styled-components';

const ProfileLabel = styled.label`
    margin: 10px;
    font-weight:bold;
    cursor:pointer;
    &:hover {
        color: gray;
    }
`;

function ProfileImageUpload({ images,
                                handleImageChange,
                                resetImages,
                                isImageDeleted,
                                userData,
                                setIsImageDeleted,
                            update}) {
    const defaultProfileImage = "https://mystudy5350.s3.amazonaws.com/test/logoblackbg.png";
    return (
        <ProfileImageWrapper>
            {images.length > 0 ? (
                <img src={images[0].preview} alt="새로운 프로필 이미지" />
            ) : isImageDeleted ? (
                <img src={defaultProfileImage} alt="삭제된 이미지" />
            ) : userData && userData.imgURL ? (
                <img src={userData.imgURL} alt="기존 프로필 이미지" />
            ) : (
                <img src={defaultProfileImage} alt="기본 프로필 이미지" />
            )}
            {update === true ?
            <>
                <ProfileLabel>
                    프로필 사진 변경하기
                    <input style={{display: "none"}} type="file" name="file" onChange={handleImageChange}/>
                </ProfileLabel>
                <button type="button" onClick={() => {
                    resetImages(); // 이미지 삭제
                    setIsImageDeleted(true); // 이미지 삭제 상태 업데이트
                }}>
                    이미지 삭제
                </button></> : null}

        </ProfileImageWrapper>
    );
}

export default ProfileImageUpload;
