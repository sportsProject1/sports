// Pagination.js
import React from 'react';
import styled from "styled-components";

const PaginationWrap = styled.div`
    text-align: center;
    padding: 15px;
`

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <PaginationWrap>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                >
                    {index + 1}
                </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </PaginationWrap>
    );
};

export default Pagination;
