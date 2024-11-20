import React, { useState } from 'react';
import styled from 'styled-components';

// 스타일링
const ImageGalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MainImage = styled.img`
  width: 600px;
  height: 700px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ThumbnailGallery = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
`;

const ThumbnailImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${(props) => (props.isActive ? '#007BFF' : 'transparent')};
  transition: border 0.3s ease;

  &:hover {
    border: 2px solid #007BFF;
  }
`;

function ShopDetailImages({ imageUrls }) {
  // 쉼표로 구분된 이미지 URL을 배열로 처리
  const images = imageUrls.split(','); // 쉼표를 기준으로 URL을 나누기

  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <ImageGalleryContainer>
      {/* 메인 이미지 */}
      <MainImage src={selectedImage} alt="상품 이미지" />

      {/* 썸네일 갤러리 */}
      <ThumbnailGallery>
        {images.map((image, index) => (
          <ThumbnailImage
            key={index}
            src={image}
            alt={`상품 썸네일 ${index + 1}`}
            isActive={image === selectedImage}
            onClick={() => handleThumbnailClick(image)}
          />
        ))}
      </ThumbnailGallery>
    </ImageGalleryContainer>
  );
}

export default ShopDetailImages;