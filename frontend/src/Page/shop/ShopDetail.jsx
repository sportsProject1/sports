import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData } from "../../Server/ApiServiceNoToken";
import ErrorPage from "../ErrorPage";
import {
    ProductDetailContainer,
    ProductInfoContainer,
    ProductName,
    ProductPrice,
    ProductDescription,
    QuantityContainer,
    StyledQuantityInput,  // 스타일 변경된 수량 입력
    QuantityButton,       // 스타일 변경된 수량 버튼
    AddToCartButton,
    ActionButton,
    ProductImageGallery,
    ProductBenefits,
} from "../../styled/Shop/ShopStyled";
import { deleteTokenData, postTokenData } from "../../Server/ApiService";
import ShopDetailImages from "./ShopDetailImages";
import styled from "styled-components";

const DetailForm = styled.form`
    width: 100%;
    display: flex;
    align-items: center; /* 수량 및 버튼들을 세로로 정렬 */
    gap: 20px;
`;

function ShopDetail() {
    const [fetchItem, setFetchItem] = useState();
    const [itemCount, setItemCount] = useState(1);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchData(`/shop/detail/${id}`).then((res) => {
            setFetchItem(res.data.item);
        });
    }, [id]);

    const cartItemSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("cartCount", itemCount);
        formData.append("itemId", id);
        await postTokenData("/mypage/cart/add", formData);
    };

    const increaseCount = () => {
        setItemCount((prevCount) => prevCount + 1);
    };

    const decreaseCount = () => {
        setItemCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
    };

    const onDelete = async () => {
        try {
            await deleteTokenData(`/shop/delete/${id}`);
            navigate("/shop", { replace: true });
        } catch (err) {
            console.log(err);
        }
    };

    const onUpdate = () => {
        navigate(`/shop/update/${id}`);
    };

    if (fetchItem) {
        const imageData = fetchItem.imgurl;
        const imageUrlArray = imageData ? imageData.split(",") : []; // 쉼표로 구분된 URL을 배열로 변환

        return (
            <ProductDetailContainer>
                {/* 좌측 이미지 갤러리 */}
                <ProductImageGallery>
                    <ShopDetailImages imageUrls={imageData} /> {/* 이미지 컴포넌트 사용 */}
                </ProductImageGallery>

                {/* 우측 정보 */}
                <ProductInfoContainer>
                    <ProductName>{fetchItem.title}</ProductName>
                    <ProductPrice>{fetchItem.price?.toLocaleString()}원</ProductPrice>

                    <ProductBenefits>
                        <p>배송비: {fetchItem.shippingCost ? fetchItem.shippingCost.toLocaleString() : '0'}원</p>
                        <p>최대 적립 {fetchItem.benefitPoints ? fetchItem.benefitPoints.toLocaleString() : '0'}원</p>
                    </ProductBenefits>

                    {/* 상품 설명 */}
                    <ProductDescription>{fetchItem.desc}</ProductDescription>

                    <DetailForm onSubmit={cartItemSubmit}>
                        {/* 수량 컨트롤 */}
                        <QuantityContainer>
                            <QuantityButton type="button" onClick={decreaseCount}>-</QuantityButton>
                            <StyledQuantityInput type="number" value={itemCount} readOnly />
                            <QuantityButton type="button" onClick={increaseCount}>+</QuantityButton>
                        </QuantityContainer>

                        {/* 장바구니 담기 버튼 */}
                        <AddToCartButton type="submit">장바구니 담기</AddToCartButton>
                    </DetailForm>

                    {/* 삭제 및 수정 버튼 */}
                    <div>
                        <ActionButton onClick={onDelete} type="button">
                            삭제하기
                        </ActionButton>
                        <ActionButton onClick={onUpdate}>수정하기</ActionButton>
                    </div>
                </ProductInfoContainer>
            </ProductDetailContainer>
        );
    } else {
        return <ErrorPage />;
    }
}

export default ShopDetail;