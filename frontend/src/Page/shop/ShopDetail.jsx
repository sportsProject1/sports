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
    StyledQuantityInput,
    QuantityButton,
    AddToCartButton,
    ActionButton,
    ProductImageGallery,
    ProductBenefits,
    TotalPriceContainer,
    TotalPriceText,
    LikeButton
} from "../../styled/Shop/ShopStyled";
import { deleteTokenData, postTokenData } from "../../Server/ApiService";
import ShopDetailImages from "./ShopDetailImages";
import styled from "styled-components";

const DetailForm = styled.form`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
`;

const PriceLikeContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

function ShopDetail() {
    const [fetchItem, setFetchItem] = useState();
    const [itemCount, setItemCount] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            if (loggedInUser) {
                setUserId(loggedInUser.userId);
                setUserRole(loggedInUser.role);
            }

            fetchData(`/shop/detail/${id}`).then((res) => {
                setFetchItem(res.data.item);
                setLikeCount(res.data.item.likes);
            });
        }, [id]);

    useEffect(() => {
        if (fetchItem) {
            setTotalPrice(fetchItem.price * itemCount);
        }
    }, [itemCount, fetchItem]);

    const cartItemSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("cartCount", itemCount);
        formData.append("itemId", id);
        await postTokenData("/mypage/cart/add", formData);
        alert('상품이 장바구니에 추가되었습니다.');
        navigate('/shop');
    };

    const increaseCount = () => {
        setItemCount((prevCount) => prevCount + 1);
    };

    const decreaseCount = () => {
        setItemCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
    };

    const onDelete = async () => {
        const userConfirmed = window.confirm("정말로 삭제하시겠습니까?");
        if (!userConfirmed) return;
        try {
            await deleteTokenData(`/shop/delete/${id}`);
            alert('상품이 성공적으로 삭제되었습니다.');
            navigate("/shop", { replace: true });
        } catch (err) {

        }
    };

    const onUpdate = () => {
        navigate(`/shop/update/${id}`);
    };

    const toggleLike = async () => {
        try {
            const response = await postTokenData(`/shop/like/${id}`);
            const updatedItem = response.data;

            setLikeCount(updatedItem.likes);
        } catch (err) {
            try {
                const fetchItemResponse = await fetchData(`/shop/detail/${id}`);
                const updatedItemFromDb = fetchItemResponse.data.item;
                setLikeCount(updatedItemFromDb.likes);
            } catch (fetchError) {

            }
        }
    };



    if (fetchItem) {
        const imageData = fetchItem.imgurl;
        const imageUrlArray = imageData ? imageData.split(",") : [];

        const isOwnerOrAdmin = fetchItem.userId === userId || userRole === 'ROLE_ADMIN';

        return (
            <ProductDetailContainer>
                {/* 좌측 이미지 갤러리 */}
                <ProductImageGallery>
                    <ShopDetailImages imageUrls={imageData} /> {/* 이미지 컴포넌트 사용 */}
                </ProductImageGallery>

                {/* 우측 정보 */}
                <ProductInfoContainer>
                    <ProductName>{fetchItem.title}</ProductName>
                    <PriceLikeContainer>
                        <ProductPrice>{fetchItem.price?.toLocaleString()}원</ProductPrice>

                    {/* 좋아요 버튼 */}
                    <LikeButton onClick={toggleLike}>
                        ♡ {likeCount}
                    </LikeButton>
                </PriceLikeContainer>

                    <ProductBenefits>
                        <p>배송비: {fetchItem.shippingCost ? fetchItem.shippingCost.toLocaleString() : '0'}원</p>
                        <p>최대 적립: {fetchItem.benefitPoints ? fetchItem.benefitPoints.toLocaleString() : '0'}원</p>
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

                    {/* 총 가격 표시 */}
                    <TotalPriceContainer>
                        <TotalPriceText>총 가격: {totalPrice.toLocaleString()}원</TotalPriceText>
                    </TotalPriceContainer>

                    {/* 삭제 및 수정 버튼 */}
                    <div>
                        {isOwnerOrAdmin && (
                            <>
                                <ActionButton onClick={onDelete} type="button">
                                    삭제하기
                                </ActionButton>
                                <ActionButton onClick={onUpdate}>수정하기</ActionButton>
                            </>
                        )}
                    </div>
                </ProductInfoContainer>
            </ProductDetailContainer>
        );
    } else {
        return <ErrorPage />;
    }
}

export default ShopDetail;