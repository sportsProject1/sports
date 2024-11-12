import React from 'react';
import {CreateLabel, CreatePreviewImage, FormGroup} from "../../styled/Form";


const CreateImageUploader = ({ images, handleFileChange }) => (
    <FormGroup>
        <CreateLabel htmlFor="image">이미지 업로드:</CreateLabel>
        {images.length > 0 && images.map((image, index) => (
            <CreatePreviewImage
                key={index}
                src={image.preview}
                alt={`업로드된 이미지 ${index + 1}`}
            />
        ))}

        <input
            type="file"
            name="file"
            onChange={handleFileChange}
            multiple // 여러 이미지 업로드 허용
        />
    </FormGroup>
);

export default CreateImageUploader;
