"use client";

import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import Button from "@/components/ui/Button";

export default function Pagination({
    page = 1,
    totalPages = 1,
    total = 0,
    limit = 10,
    onPageChange,
    loading = false,
}) {
    if (!total || totalPages <= 1) {
        return null;
    }

    const currentPage = Math.max(
        1,
        Math.min(page, totalPages),
    );

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(
        currentPage * limit,
        total,
    );

    const handlePageChange = (newPage) => {
        if (
            loading ||
            newPage < 1 ||
            newPage > totalPages ||
            newPage === currentPage
        ) {
            return;
        }

        onPageChange(newPage);
    };

    /*
     * Generate page numbers.
     *
     * Example:
     * 1 2 3 4 5
     *
     * or:
     * 1 ... 4 5 6 ... 10
     */
    const getPages = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        pages.push(1);

        if (currentPage > 4) {
            pages.push("...");
        }

        const startPage = Math.max(
            2,
            currentPage - 1,
        );

        const endPage = Math.min(
            totalPages - 1,
            currentPage + 1,
        );

        for (
            let i = startPage;
            i <= endPage;
            i++
        ) {
            pages.push(i);
        }

        if (currentPage < totalPages - 3) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    return (
        <div
            className="
        flex
        flex-col
        gap-3
        border-t
        border-border
        px-5
        py-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
        >
            {/* Results */}
            <div className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                    {start}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                    {end}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                    {total}
                </span>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-1">
                {/* First */}
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={loading || currentPage === 1}
                    onClick={() => handlePageChange(1)}
                    title="First page"
                >
                    <ChevronsLeft size={16} />
                </Button>

                {/* Previous */}
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={loading || currentPage === 1}
                    onClick={() =>
                        handlePageChange(currentPage - 1)
                    }
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                </Button>

                {/* Page Numbers */}
                <div className="hidden items-center gap-1 sm:flex">
                    {getPages().map((item, index) => {
                        if (item === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    text-sm
                    text-muted-foreground
                  "
                                >
                                    ...
                                </span>
                            );
                        }

                        const active =
                            item === currentPage;

                        return (
                            <Button
                                key={item}
                                variant={active ? "default" : "ghost"}
                                size="icon"
                                disabled={loading}
                                onClick={() =>
                                    handlePageChange(item)
                                }
                                className="h-9 w-9"
                            >
                                {item}
                            </Button>
                        );
                    })}
                </div>

                {/* Mobile Page */}
                <span className="px-2 text-sm text-muted-foreground sm:hidden">
                    {currentPage} / {totalPages}
                </span>

                {/* Next */}
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                        loading ||
                        currentPage === totalPages
                    }
                    onClick={() =>
                        handlePageChange(currentPage + 1)
                    }
                    title="Next page"
                >
                    <ChevronRight size={16} />
                </Button>

                {/* Last */}
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                        loading ||
                        currentPage === totalPages
                    }
                    onClick={() =>
                        handlePageChange(totalPages)
                    }
                    title="Last page"
                >
                    <ChevronsRight size={16} />
                </Button>
            </div>
        </div>
    );
}