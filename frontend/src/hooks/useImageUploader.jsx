import { useState } from 'react';

const useImageUploader = (isMultiple = false) => { // 기본값으로 isMultiple 을 false로 지정
    const [images, setImages] = useState([]);
// 이미지를 담아둘 useState
    const handleImageChange = (e) => {
        // 이미지 업로드 및 url따오는 함수
        const files = Array.from(e.target.files); // 선택된 파일 목록
        const imagePreviews = files.map((file) => URL.createObjectURL(file)); // 미리보기 URL 생성

        if (isMultiple) {
            // 다수의 이미지인 경우
            setImages((prevImages) => prevImages.concat(imagePreviews)); // 기존 이미지와 새 이미지를 합칩니다.
        } else {
            // 단일 이미지인 경우
            setImages(imagePreviews); // 새 이미지를 설정
        }
    };

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // 선택한 이미지 제거
    };

    const resetImages = () => {
        setImages([]); // 이미지 초기화
    };

    return { images, handleImageChange, handleRemoveImage, resetImages };
};

export default useImageUploader;
