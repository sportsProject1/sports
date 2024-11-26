import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchData } from "../../Server/ApiServiceNoToken";
import { ShopContainer } from "../../styled/shopStyled";
import SideMenu from "../../Components/Menu/SideMenu";
import ItemWrapper from "./ItemWrapper";
import LoadingPage from "../../Components/LoadingPage";
import useLikeStatus from "../../hooks/useLikeStatus";

function Shop() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState([]);
    const { shop } = useParams(); // 카테고리 이름 파라미터
    const location = useLocation(); // 현재 위치 (쿼리 파라미터 추출용)
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [sortOption, setSortOption] = useState("latest"); // 정렬 옵션 상태

    const itemIds = useMemo(() => items.map((item) => item.id), [items]);
    const { likeStatus, error } = useLikeStatus(itemIds, "Item", "shop");

    // 쿼리 파라미터에서 검색어 추출
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        if (keyword) {
            setSearchQuery(keyword);
        }
    }, [location]);

    // 데이터 요청 (아이템과 카테고리)
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [itemsResponse, categoryResponse] = await Promise.all([fetchData("/shop/list"), fetchData("/category/get")]);
                setItems(itemsResponse.data.items);
                setCategory(categoryResponse.data);
            } catch (error) {
                console.error("데이터 로딩 중 오류:", error);
            }
        };
        fetchAllData();
    }, []); // 처음에 한 번만 데이터 로드

    // 카테고리 필터링 (shop 태그가 달린 카테고리만)
    const shopCategories = useMemo(() => category.filter(cat => cat.tag === "shop"), [category]);

    // 검색어 필터링
    const filteredItemsBySearch = useMemo(() => {
        if (!searchQuery.trim()) return items;
        return items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, items]);

    // 카테고리 필터링 (shop 파라미터가 있을 경우 해당 카테고리만 필터링)
    const filteredItemsByCategory = useMemo(() => {
        if (!shop) return items; // shop 파라미터가 없으면 전체 아이템
        const matchedCategory = shopCategories.find(cat => cat.enName === shop);
        return matchedCategory ? items.filter(item => item.categoryId === matchedCategory.id) : [];
    }, [shop, items, shopCategories]);

    // 검색어와 카테고리 필터링이 결합되지 않도록 처리
    const finalFilteredItems = useMemo(() => {
        if (searchQuery.trim()) {
            return filteredItemsBySearch; // 검색어가 있으면 검색어 필터링된 결과만 반환
        }
        return filteredItemsByCategory; // 검색어 없으면 카테고리 필터링된 결과 반환
    }, [filteredItemsBySearch, filteredItemsByCategory, searchQuery]);

    // 정렬 변경 처리 함수
    const handleSortChange = (newSortOption) => {
        setSortOption(newSortOption); // 정렬 기준 업데이트
    };

    // 아이템 정렬
    const sortedItems = useMemo(() => {
        const itemsCopy = [...finalFilteredItems];
        switch (sortOption) {
            case "latest":
                return itemsCopy.sort((a, b) => b.id - a.id);
            case "likes":
                return itemsCopy.sort((a, b) => b.likes - a.likes);
            case "priceAsc":
                return itemsCopy.sort((a, b) => a.price - b.price); // 가격 낮은 순
            case "priceDesc":
                return itemsCopy.sort((a, b) => b.price - a.price); // 가격 높은 순
            default:
                return itemsCopy;
        }
    }, [finalFilteredItems, sortOption]);

    // 카테고리 클릭 시 URL 변경
    const handleCategoryClick = (category) => {
        if (category && category.enName) {
            navigate(`/shop/${category.enName}`); // 카테고리 클릭 시 URL 변경
        }
    };

    // 데이터가 없으면 로딩 화면 표시
    if (!items.length || !category.length) {
        return <LoadingPage />;
    }

    return (
        <ShopContainer>
            <SideMenu
                params={"/shop"}
                category={shopCategories}
                categoryTitle={"카테고리"}
                handleCategoryClick={handleCategoryClick}
            />
            <ItemWrapper
                items={sortedItems} // 정렬된 아이템 전달
                handleSortChange={handleSortChange}
                isShop={true}
                sortOption={sortOption} // 정렬 옵션 전달
                likeStatus={likeStatus}
            />
        </ShopContainer>
    );
}

export default Shop;