import Pagination from "./Pagination";
import {CreateButton, CreateButtonContainer, PaginationContainer} from "../../styled/Common";
import React from "react";
import {useSelector} from "react-redux";

function PagePagination({totalItems,itemsPerPage,currentPage,onPageChange,Text,navigate}) {
    const userRole = useSelector((state)=>state.auth.user?.role);
    return (
        <PaginationContainer>
            <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />
            {Text && (
            <CreateButtonContainer>
                {userRole && Text === "글 작성" ?
                    <CreateButton
                    onClick={navigate}>{Text}</CreateButton> :
                    Text === "상품 추가" && userRole !== "ROLE_USER" ? <CreateButton
                    onClick={navigate}>{Text}</CreateButton> : null}

            </CreateButtonContainer>
            )}
        </PaginationContainer>
    )
}
export default PagePagination

