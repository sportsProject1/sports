import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchData } from "../../Server/ApiServiceNoToken";
import { ShopContainer } from "../../styled/shopStyled";
import SideMenu from "../../Components/Menu/SideMenu";
import ItemWrapper from "./ItemWrapper";
import LoadingPage from "../../Components/LoadingPage";

function Shop() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState([]);
    const { shop } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 쿼리 파라미터에서 검색어 추출
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        if (keyword) {
            setSearchQuery(keyword);
        }
    }, [location]);

    // 데이터 요청 (전체 상품과 카테고리 가져오기)
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                let itemsResponse;
                if (searchQuery.trim()) {
                    // 검색어가 있을 때 검색 API 호출
                    itemsResponse = await fetchData(`/shop/search?keyword=${searchQuery}`);
                } else {
                    // 검색어가 없을 때 전체 상품 가져오기
                    itemsResponse = await fetchData("/shop/list");
                }
                setItems(itemsResponse.data.items);
                const categoryResponse = await fetchData("/category/get");
                setCategory(categoryResponse.data); // 카테고리 데이터를 가져옵니다.
            } catch (error) {
                console.error("데이터 로딩 중 오류:", error);
            }
        };

        fetchAllData();
    }, [searchQuery]);  // 검색어가 변경될 때마다 실행

    // 'shop' 태그가 있는 카테고리만 필터링
    const shopCategories = useMemo(() => {
        return category.filter(cat => cat.tag === "shop");
    }, [category]);

    // 필터링된 상품 목록
    const filteredShopItems = useMemo(() => {
        let filteredItems = items;
        if (selectedCategory) {
            filteredItems = filteredItems.filter(item => item.categoryId === selectedCategory.id);
        }
        return filteredItems;
    }, [selectedCategory, items]);

    return (
        <ShopContainer>
            <SideMenu
                category={shopCategories} // 'shop' 태그가 있는 카테고리만 전달
                selectedCategory={selectedCategory} // 선택된 카테고리 전달
                setSelectedCategory={setSelectedCategory} // 카테고리 변경 함수 전달
            />
            <ItemWrapper items={filteredShopItems} />
        </ShopContainer>
    );
}

export default Shop;