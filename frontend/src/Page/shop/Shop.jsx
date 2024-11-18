import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData } from "../../Server/ApiServiceNoToken";
import { ShopContainer } from "../../styled/shopStyled";
import SideMenu from "../../Components/Menu/SideMenu";
import ItemWrapper from "./ItemWrapper";
import LoadingPage from "../../Components/LoadingPage";

function Shop() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState();
    const { shop } = useParams();
    const navigate = useNavigate();

    // Fetch items and categories
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [itemsResponse, categoryResponse] = await Promise.all([
                    fetchData("/shop/list"),
                    fetchData("/category/get")
                ]);
                setItems(itemsResponse.data.items);
                setCategory(categoryResponse.data);
            } catch (error) {
                console.error("데이터 로딩 중 오류:", error);
            }
        };
        fetchAllData();
    }, []);

    // Memoize filtered items to prevent unnecessary calculations on each render
    const filteredShopItems = useMemo(() => {
        if (!shop) return items;
        const matchedCategory = category?.find(cat => cat.enName === shop);
        return matchedCategory ? items.filter(item => item.categoryId === matchedCategory.id) : [];
    }, [shop, items, category]);

    // Filter shop-related categories
    const sportCategories = useMemo(() => category?.filter(item => item.tag === 'shop'), [category]);

    // Loading state handling

    return (
        <ShopContainer>
            <SideMenu
                params={"/shop"}
                category={sportCategories}
                categoryTitle={"카테고리"}
            />
            <ItemWrapper items={filteredShopItems} />
        </ShopContainer>
    );
}

export default Shop;
