import Pagination from "./Pagination";
import {CreateButton, CreateButtonContainer, PaginationContainer} from "../../styled/Common";
import React from "react";

function PagePagination({totalItems,itemsPerPage,currentPage,onPageChange,Text,navigate}) {
    return (
        <PaginationContainer>
            <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />

            <CreateButtonContainer>
                <CreateButton
                onClick={navigate}>{Text}</CreateButton>
            </CreateButtonContainer>
        </PaginationContainer>
    )
}
export default PagePagination

