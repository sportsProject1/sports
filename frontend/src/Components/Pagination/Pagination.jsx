// Pagination.js
import React from 'react';
import styled from "styled-components";

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin-top: 20px;
`;

// 페이지 버튼 스타일
const PageButton = styled.button`
    background-color: ${({ active }) => (active ? '#4CAF50' : '#f0f0f0')};
    color: ${({ active }) => (active ? 'white' : '#333')};
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: ${({ active }) => (active ? '#45a049' : '#ddd')};
    }

    &:disabled {
        cursor: not-allowed;
        background-color: #e0e0e0;
        color: #999;
    }
`;

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <PaginationWrapper>
            <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </PageButton>
            {Array.from({ length: totalPages }, (_, index) => (
                <PageButton
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                >
                    {index + 1}
                </PageButton>
            ))}
            <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </PageButton>
        </PaginationWrapper>
    );
};

export default Pagination;
