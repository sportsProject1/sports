import Pagination from "./Pagination";
import {CreateButton, CreateButtonContainer, PaginationContainer} from "../../styled/Common";
import React from "react";
import {useSelector} from "react-redux";

function PagePagination({totalItems,itemsPerPage,currentPage,onPageChange,Text,navigate}) {
    const user = useSelector((state)=>state.auth.user);
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
                {user? <CreateButton
                    onClick={navigate}>{Text}</CreateButton> : null}

            </CreateButtonContainer>
            )}
        </PaginationContainer>
    )
}
export default PagePagination

