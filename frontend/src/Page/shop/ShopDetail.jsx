import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchData } from "../../Server/ApiServiceNoToken";
import ErrorPage from "../ErrorPage";
import {
    ProductDetailContainer,
    ProductImageGallery,
    ProductImage,
    ProductInfoContainer,
    ProductName,
    ProductDiscount,
    ProductOriginalPrice,
    ProductPrice,
    ProductBenefits,
    QuantityContainer,
    QuantityInput,
    AddToCartButton,
    ActionButton
} from "../../styled/Shop/ShopStyled";
import { deleteTokenData, postTokenData } from "../../Server/ApiService";
import styled from "styled-components";


const DetailForm = styled.form`
    width: 100%;
    
`
function ShopDetail() {
    const [fetchItem, setFetchItem] = useState();
    const [itemCount, setItemCount] = useState(1);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchData(`/shop/detail/${id}`, setFetchItem);
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
            console.log("Item deleted successfully");
        } catch (err) {
            console.log(err);
        }
    };

    const onUpdate = () => {
        navigate(`/shop/update/${id}`);
    };

    if (fetchItem) {
        const imageData = fetchItem.imgurl;
        const imageUrlArray = imageData ? imageData.split(',') : [];

        return (
            <ProductDetailContainer>
                {/* 좌측 이미지 갤러리 */}
                <ProductImageGallery>
                    {imageUrlArray.map((image, index) => (
                        <ProductImage src={image} alt={`상품 이미지 ${index + 1}`} key={image} />
                    ))}
                </ProductImageGallery>

                {/* 우측 정보 */}
                <ProductInfoContainer>
                    <ProductName>{fetchItem.title}</ProductName>
                    {fetchItem.discountRate && (
                        <ProductDiscount>{fetchItem.discountRate}% 할인</ProductDiscount>
                    )}
                    {fetchItem.originalPrice && (
                        <ProductOriginalPrice>
                            {fetchItem.originalPrice.toLocaleString()}원
                        </ProductOriginalPrice>
                    )}
                    <ProductPrice>{fetchItem.price?.toLocaleString()}원</ProductPrice>

                    <ProductBenefits>
                        <p>배송비: {fetchItem.shippingCost ? fetchItem.shippingCost.toLocaleString() : '0'}원</p>
                        <p>구매 혜택: 최대 적립 {fetchItem.benefitPoints ? fetchItem.benefitPoints.toLocaleString() : '0'}원</p>
                    </ProductBenefits>

                    <DetailForm onSubmit={cartItemSubmit}>
                        <QuantityContainer>
                            <button type="button" onClick={decreaseCount}>-</button>
                            <QuantityInput type="number" value={itemCount} readOnly />
                            <button type="button" onClick={increaseCount}>+</button>
                        </QuantityContainer>
                        <AddToCartButton type="submit">장바구니 담기</AddToCartButton>
                        <div>
                            <ActionButton onClick={onDelete} type="button">삭제하기</ActionButton>
                            <ActionButton onClick={onUpdate}>수정하기</ActionButton>
                        </div>
                    </DetailForm>
                </ProductInfoContainer>
            </ProductDetailContainer>
        );
    } else {
        return <ErrorPage />;
    }
}

export default ShopDetail;
