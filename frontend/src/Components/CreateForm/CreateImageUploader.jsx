import React from 'react';
import {CreateLabel, CreatePreviewImage, FormGroup} from "../../styled/Form";


function CreateImageUploader ({ images, handleFileChange,handleRemoveImage,imageArray,setImageArray }){
    const handleRemoveImageAndArrayUpdate = (index, image) => {
        console.log('삭제된 이미지 URL:', image); // 이미지 URL 콘솔 출력

        // 미리보기 이미지 삭제
        handleRemoveImage(index);

        // 인덱스를 기반으로 imageArray에서 같은 위치의 이미지를 제거

        const removeItem = [...imageArray];
        removeItem.splice(index, 1);
        setImageArray(removeItem);

    };

    return(
    <FormGroup>
        <button onClick={()=>console.log(images)}>이미지이미지</button>
        <CreateLabel htmlFor="image">이미지 업로드:</CreateLabel>
        {images.length > 0 && images.map((image, index) => (
            <div key={index}>
            <CreatePreviewImage
                src={image}
                alt={`업로드된 이미지 ${index + 1}`}
            />
                <button
                    type={"button"}
                    onClick={()=>handleRemoveImageAndArrayUpdate(index,image)}>삭제</button>
            </div>
        ))}

        <input
            type="file"
            name="file"
            onChange={handleFileChange}
            multiple // 여러 이미지 업로드 허용
        />
    </FormGroup>
    )
}

export default CreateImageUploader;
