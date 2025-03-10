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
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    padding: 12px;
    margin: 12px 0;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
        border-color: #4e9f3d;
    }

    &::placeholder {
        color: #888;
    }
`;

const Select = styled.select`
    padding: 12px;
    margin: 12px 0;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 16px;
    outline: none;
    background-color: #fff;
    transition: border-color 0.3s;

    &:focus {
        border-color: #4e9f3d;
    }
`;

const Button = styled.button`
    padding: 14px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    cursor: pointer;
    margin: 12px 0;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #0056b3;
    }
`;

const ImageContainer = styled.div`
    display: flex;
    overflow-x: auto;
    margin-top: 20px;
`;

const ImageWrapper = styled.div`
    position: relative;
    margin: 5px;
`;

const Image = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
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
    font-size: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: darkred;
    }
`;

const Title = styled.h1`
    text-align: center;
    font-size: 28px;
    margin-bottom: 30px;
    color: #333;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin: 5px 0;
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

    const [errorMessages, setErrorMessages] = useState({
        title: "",
        price: "",
        desc: "",
        stock: "",
        categoryId: ""
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !['ROLE_SELLER', 'ROLE_MANAGER', 'ROLE_ADMIN'].includes(user.role)) {
            alert('잘못된 접근입니다. 로그인페이지로 이동합니다.');
            navigate('/login');
            return;
        }

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
            }
        };

        fetchDataForItem();
    }, [id]);

    // 기존 이미지 삭제 핸들러
    const handleRemoveExistingImage = (index) => {
        setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const errors = {};

        if (!addItem.title) errors.title = "상품명을 입력해주세요.";
        if (!addItem.price || isNaN(addItem.price) || Number(addItem.price) <= 0) errors.price = "가격을 올바르게 입력해주세요.";
        if (!addItem.desc) errors.desc = "상품 설명을 입력해주세요.";
        if (!addItem.stock || isNaN(addItem.stock) || Number(addItem.stock) < 0) errors.stock = "재고 수량을 올바르게 입력해주세요.";
        if (!addItem.categoryId) errors.categoryId = "카테고리를 선택해주세요.";
        if (images.length === 0 && existingImages.length === 0) {
                errors.image = "상품이미지를 등록해주세요.";
        }

        setErrorMessages(errors);

        // 유효성 검사에서 오류가 있으면 false 반환
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        const isValid = validateForm();
        if (!isValid) return;

        const userConfirmed = window.confirm(id ? '상품을 수정하시겠습니까?' : '상품을 등록하시겠습니까?');

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
                alert('상품이 성공적으로으로 수정되었습니다.');
            } else {
                // 추가 요청 (POST)
                await postTokenData("/shop/add", addItemFormData);
                alert('상품이 성공적으로으로 등록되었습니다.');
            }
            navigate("/shop");
        } catch (error) {
        }
    };

    return (
            <Container>
                <FormTest onSubmit={handleSubmit} encType="multipart/form-data">
                    <Title>{id ? "상품 수정" : "상품 추가"}</Title>
                    <Input
                        onChange={(e) => handleChange(e, addItem, setAddItem)}
                        type="text"
                        placeholder="상품명"
                        name="title"
                        value={addItem.title}
                    />
                    {errorMessages.title && <ErrorMessage>{errorMessages.title}</ErrorMessage>}

                    <Input
                        onChange={(e) => handleChange(e, addItem, setAddItem)}
                        type="text"
                        placeholder="가격"
                        name="price"
                        value={addItem.price}
                    />
                    {errorMessages.price && <ErrorMessage>{errorMessages.price}</ErrorMessage>}

                    <Input
                        onChange={(e) => handleChange(e, addItem, setAddItem)}
                        type="text"
                        placeholder="상품소개"
                        name="desc"
                        value={addItem.desc}
                    />
                    {errorMessages.desc && <ErrorMessage>{errorMessages.desc}</ErrorMessage>}

                    <Input type="file" name="file" multiple onChange={handleImageChange} />
                    {errorMessages.title && <ErrorMessage>{errorMessages.image}</ErrorMessage>}
                    <Input
                        onChange={(e) => handleChange(e, addItem, setAddItem)}
                        type="text"
                        placeholder="재고"
                        name="stock"
                        value={addItem.stock}
                    />
                    {errorMessages.stock && <ErrorMessage>{errorMessages.stock}</ErrorMessage>}

                    <Select
                        name="categoryId"
                        onChange={(e) => handleChange(e, addItem, setAddItem)}
                        value={addItem.categoryId}
                    >
                        {category.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </Select>
                    {errorMessages.categoryId && <ErrorMessage>{errorMessages.categoryId}</ErrorMessage>}

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

                    <Button type="submit">{id ? "상품 수정" : "상품 등록"}</Button>
                </FormTest>
            </Container>
        );
    }

export default ShopAdd;