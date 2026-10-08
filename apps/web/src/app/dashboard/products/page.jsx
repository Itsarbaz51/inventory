"use client";

import React, { useMemo, useState } from "react";

import {
    Plus,
    RefreshCw,
    Package,
    PackageCheck,
    PackageX,
    IndianRupee,
} from "lucide-react";

import ProductTable from "@/components/tables/ProductTable";

import ProductModal from "@/components/models/ProductModal";
import ProductViewModal from "@/components/models/view/ProductViewModal";

import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";

import useProducts from "@/hooks/products/useProducts";
import useCreateProduct from "@/hooks/products/useCreateProduct";
import useUpdateProduct from "@/hooks/products/useUpdateProduct";
import useDeleteProduct from "@/hooks/products/useDeleteProduct";

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [isActive, setIsActive] = useState("ALL");

    const [page, setPage] = useState(1);
    const [limit] = useState(12);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingProduct, setViewingProduct] = useState(null);

    // =====================================================
    // QUERY PARAMS
    // =====================================================

    const queryParams = useMemo(() => {
        const params = {
            page,
            limit,
        };

        if (search.trim()) {
            params.search = search.trim();
        }

        if (isActive !== "ALL") {
            params.isActive = isActive === "ACTIVE";
        }

        return params;
    }, [page, limit, search, isActive]);

    // =====================================================
    // API
    // =====================================================

    const {
        data,
        isLoading,
        refetch,
    } = useProducts(queryParams);

    const createProduct = useCreateProduct();

    const updateProduct = useUpdateProduct();

    const deleteProduct = useDeleteProduct();

    // =====================================================
    // DATA
    // =====================================================

    const products =
        data?.data?.products ||
        data?.data ||
        [];

    const pagination =
        data?.data?.pagination || {
            page,
            limit,
            total: 0,
            totalPages: 1,
        };

    // =====================================================
    // STATS
    // =====================================================

    const stats = useMemo(() => {
        const total = Number(pagination?.total || 0);

        const active = products.filter(
            (product) => product.isActive,
        ).length;

        const inactive = products.filter(
            (product) => !product.isActive,
        ).length;

        const totalValue = products.reduce(
            (sum, product) =>
                sum +
                Number(product.sellingPrice || 0),
            0,
        );

        return [
            {
                id: "total",
                title: "Total Products",
                value: total,
                description: "Registered products",
                icon: Package,
                iconClassName:
                    "bg-primary/10 text-primary",
            },

            {
                id: "active",
                title: "Active",
                value: active,
                description: "Active products",
                icon: PackageCheck,
                iconClassName:
                    "bg-green-500/10 text-green-600",
            },

            {
                id: "inactive",
                title: "Inactive",
                value: inactive,
                description: "Inactive products",
                icon: PackageX,
                iconClassName:
                    "bg-red-500/10 text-red-600",
            },

            {
                id: "value",
                title: "Selling Value",
                value: `₹${totalValue.toLocaleString("en-IN")}`,
                description: "Current page value",
                icon: IndianRupee,
                iconClassName:
                    "bg-purple-500/10 text-purple-600",
            },
        ];
    }, [products, pagination?.total]);

    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (product) => {
        setViewingProduct(product);
        setViewModalOpen(true);
    };

    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (payload) => {
        try {
            if (editingProduct) {
                await updateProduct.mutateAsync({
                    id: editingProduct.id,
                    payload,
                });
            } else {
                await createProduct.mutateAsync(payload);
            }

            setModalOpen(false);
            setEditingProduct(null);

            await refetch();
        } catch (error) {
            console.error(
                "Failed to save product:",
                error,
            );
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${product?.name}?`,
        );

        if (!confirmed) return;

        try {
            await deleteProduct.mutateAsync(
                product.id,
            );

            await refetch();
        } catch (error) {
            console.error(
                "Failed to delete product:",
                error,
            );
        }
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClearFilters = () => {
        setSearch("");
        setIsActive("ALL");
        setPage(1);
    };

    const saving =
        createProduct.isPending ||
        updateProduct.isPending;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Package}
                title="Products"
                description="Manage your products and inventory items"
                secondaryAction={{
                    label: "Refresh",
                    icon: (
                        <RefreshCw
                            size={16}
                            className={
                                isLoading
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                    ),
                    onClick: refetch,
                    disabled: isLoading,
                }}
                primaryAction={{
                    label: "Add Product",
                    icon: <Plus size={17} />,
                    onClick: handleAdd,
                }}
            />

            {/* STATS */}

            <StatsCards
                stats={stats}
                columns={4}
            />

            {/* FILTERS */}

            <FilterBar
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                searchPlaceholder="Search products..."
                filters={[
                    {
                        name: "status",
                        value: isActive,
                        onChange: (value) => {
                            setIsActive(value);
                            setPage(1);
                        },
                        placeholder: "All Status",
                        options: [
                            {
                                value: "ALL",
                                label: "All Status",
                            },
                            {
                                value: "ACTIVE",
                                label: "Active",
                            },
                            {
                                value: "INACTIVE",
                                label: "Inactive",
                            },
                        ],
                    },
                ]}
                onClear={handleClearFilters}
            />

            {/* TABLE */}

            <ProductTable
                products={products}
                loading={isLoading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                page={
                    Number(pagination.page) ||
                    page
                }
                totalPages={
                    Number(pagination.totalPages) ||
                    1
                }
                total={
                    Number(pagination.total) || 0
                }
                limit={
                    Number(pagination.limit) ||
                    limit
                }
                onPageChange={setPage}
            />

            {/* CREATE / UPDATE MODAL */}

            <ProductModal
                open={modalOpen}
                onClose={() => {
                    if (saving) return;

                    setModalOpen(false);
                    setEditingProduct(null);
                }}
                product={editingProduct}
                onSubmit={handleSubmit}
                loading={saving}
            />

            {/* VIEW MODAL */}

            <ProductViewModal
                open={viewModalOpen}
                product={viewingProduct}
                onClose={() => {
                    setViewModalOpen(false);
                    setViewingProduct(null);
                }}
            />
        </div>
    );
}