import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useImageUploader from "../../hooks/useImageUploader";
import { handleChange } from "../../Utils/handleChange";
import { Container } from "../../styled/Container";
import styled from "styled-components";
import { postTokenData, putTokenData } from "../../Server/ApiService";
import { fetchData } from "../../Server/ApiServiceNoToken";

const FormTest = styled.form`
    width: 50%;
    margin: auto;
    display: flex;
    flex-direction: column;
    >input,select{
        padding:15px;
        margin:15px 0;
    }
`;

const ImageContainer = styled.div`
    display: flex;
    overflow-x: auto;
`;

const ImageWrapper = styled.div`
    position: relative;
    margin: 5px;
`;

const Image = styled.img`
    width: 100px;
    height: 100px;
`;

const RemoveButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
`;

function ShopAdd() {
    const { id } = useParams(); // 상품 ID를 URL에서 가져옴
    const navigate = useNavigate();

    const [addItem, setAddItem] = useState({
        title: "",
        price: "",
        desc: "",
        file: "",
        stock: "",
        categoryId: ""
    });

    const { images, handleImageChange, handleRemoveImage } = useImageUploader(true);

    const [category, setCategory] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // 기존 이미지 상태 관리

    useEffect(() => {
        const fetchDataForItem = async () => {
            try {
                if (id) {
                    // 상품 ID가 있는 경우 해당 상품의 상세 정보를 불러옴
                    const itemResponse = await fetchData(`/shop/detail/${id}`);
                    const updateItem = itemResponse.data.item;

                    setAddItem((prevItem) => ({
                        ...prevItem,
                        title: updateItem.title,
                        price: updateItem.price,
                        desc: updateItem.desc,
                        stock: updateItem.stock,
                        categoryId: updateItem.categoryId,
                    }));

                    // 기존 이미지 URL 배열로 저장
                    if (updateItem.imgurl) {
                        setExistingImages(updateItem.imgurl.split(',').map((url) => url.trim()));
                    }
                }

                // 카테고리 정보 불러오기
                const categoryResponse = await fetchData('/category/get');
                const filteredCategories = categoryResponse.data.filter(item => item.tag === 'shop');
                setCategory(filteredCategories);

                // id가 없는 경우 카테고리 ID 기본값 설정
                if (!id && filteredCategories.length > 0) {
                    setAddItem((prevItem) => ({
                        ...prevItem,
                        categoryId: filteredCategories[0].id,
                    }));
                }
            } catch (error) {
                console.error("데이터 로딩 중 오류:", error);
            }
        };

        fetchDataForItem();
    }, [id]);

    // 기존 이미지 삭제 핸들러
    const handleRemoveExistingImage = (index) => {
        setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const addItemFormData = new FormData();
        addItemFormData.append("title", addItem.title);
        addItemFormData.append("price", addItem.price);
        addItemFormData.append("desc", addItem.desc);
        addItemFormData.append("stock", addItem.stock);
        addItemFormData.append("categoryId", addItem.categoryId);

        // 기존 이미지를 서버에 전달
        if (existingImages.length > 0) {
            addItemFormData.append("existingImages", existingImages.join(','));
        }

        // 새로 추가된 이미지 파일 추가
        images.forEach((image) => {
            addItemFormData.append("file", image.file);
        });

        try {
            if (id) {
                // 수정 요청 (PUT)
                await putTokenData(`/shop/update/${id}`, addItemFormData);
            } else {
                // 추가 요청 (POST)
                await postTokenData("/shop/add", addItemFormData);
            }
            navigate("/shop");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{id ? "상품 수정 페이지" : "상품 추가 페이지"}</h1>
            <FormTest onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type="text"
                    placeholder="상품명"
                    name="title"
                    value={addItem.title}
                />
                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type="text"
                    placeholder="가격"
                    name="price"
                    value={addItem.price}
                />
                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type="text"
                    placeholder="상품소개"
                    name="desc"
                    value={addItem.desc}
                />
                <input type="file" name="file" multiple onChange={handleImageChange} />
                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type="text"
                    placeholder="재고"
                    name="stock"
                    value={addItem.stock}
                />
                <select
                    name="categoryId"
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    value={addItem.categoryId}
                >
                    {category.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>

                {/* 기존 이미지 표시 및 삭제 버튼 추가 */}
                <ImageContainer>
                    {existingImages.map((url, index) => (
                        <ImageWrapper key={index}>
                            <Image src={url} alt={`existing preview ${index}`} />
                            <RemoveButton type="button" onClick={() => handleRemoveExistingImage(index)}>
                                X
                            </RemoveButton>
                        </ImageWrapper>
                    ))}

                    {/* 새로 추가된 이미지 표시 */}
                    {images.map((image, index) => (
                        <ImageWrapper key={index}>
                            <Image src={image.preview} alt={`preview ${index}`} />
                            <RemoveButton type="button" onClick={() => handleRemoveImage(index)}>
                                X
                            </RemoveButton>
                        </ImageWrapper>
                    ))}
                </ImageContainer>

                <input type="submit" value={id ? "상품 수정" : "상품 등록"} />
            </FormTest>
        </Container>
    );
}

export default ShopAdd;
