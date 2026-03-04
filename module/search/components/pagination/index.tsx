'use client';

import React from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const generatePageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = generatePageNumbers();

    return (
        <div className="join w-full justify-center">
            <button
                className="join-item btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <BiChevronLeft size={20} />
            </button>

            {pages[0] > 1 && (
                <>
                    <button className="join-item btn" onClick={() => onPageChange(1)}>
                        1
                    </button>
                    {pages[0] > 2 && <button className="join-item btn btn-disabled">...</button>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && (
                        <button className="join-item btn btn-disabled">...</button>
                    )}
                    <button className="join-item btn" onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </button>
                </>
            )}

            <button
                className="join-item btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <BiChevronRight size={20} />
            </button>
        </div>
    );
};
