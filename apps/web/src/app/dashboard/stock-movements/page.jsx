"use client";
<<<<<<< HEAD
import { ArrowLeftRight } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { stockMovementsApi } from "@/services/inventoryApi";

export default function StockMovementsPage() {
  return <ResourceListPage icon={ArrowLeftRight} title="Stock Movements" description="Audit inventory movement history" queryKey="stock-movements" queryFn={stockMovementsApi.getAll} resourceKey="movements" searchPlaceholder="Search stock movements..." columns={[{ label: "Product", value: (row) => row.product?.name }, { label: "Warehouse", value: (row) => row.warehouse?.name }, { label: "Type", key: "type" }, { label: "Quantity", key: "quantity" }, { label: "Date", key: "createdAt", type: "date" }]} />;
}
=======

import React, { useMemo, useState } from "react";

import {
    Plus,
    RefreshCw,
    Boxes,
    ArrowDownToLine,
    ArrowUpFromLine,
    Activity,
} from "lucide-react";

import StockMovementTable from "@/components/tables/StockMovementTable";

import StockMovementModal from "@/components/models/StockMovementModal";

import StockMovementViewModal from "@/components/models/view/StockMovementViewModal";

import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";

import useStockMovements from "@/hooks/stockMovements/useStockMovements";
import useCreateStockMovement from "@/hooks/stockMovements/useCreateStockMovement";
import useDeleteStockMovement from "@/hooks/stockMovements/useDeleteStockMovement";

const MOVEMENT_TYPES = [
    {
        value: "OPENING_STOCK",
        label: "Opening Stock",
    },
    {
        value: "PURCHASE",
        label: "Purchase",
    },
    {
        value: "SALE",
        label: "Sale",
    },
    {
        value: "PURCHASE_RETURN",
        label: "Purchase Return",
    },
    {
        value: "SALES_RETURN",
        label: "Sales Return",
    },
    {
        value: "TRANSFER_IN",
        label: "Transfer In",
    },
    {
        value: "TRANSFER_OUT",
        label: "Transfer Out",
    },
    {
        value: "ADJUSTMENT_IN",
        label: "Adjustment In",
    },
    {
        value: "ADJUSTMENT_OUT",
        label: "Adjustment Out",
    },
];

const REFERENCE_TYPES = [
    {
        value: "OPENING",
        label: "Opening",
    },
    {
        value: "PURCHASE",
        label: "Purchase",
    },
    {
        value: "SALE",
        label: "Sale",
    },
    {
        value: "PURCHASE_RETURN",
        label: "Purchase Return",
    },
    {
        value: "SALES_RETURN",
        label: "Sales Return",
    },
    {
        value: "TRANSFER",
        label: "Transfer",
    },
    {
        value: "ADJUSTMENT",
        label: "Adjustment",
    },
];

export default function StockMovementsPage() {
    const [productId, setProductId] =
        useState("");

    const [warehouseId, setWarehouseId] =
        useState("");

    const [movementType, setMovementType] =
        useState("ALL");

    const [referenceType, setReferenceType] =
        useState("ALL");

    const [page, setPage] = useState(1);

    const [limit] = useState(12);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [
        viewModalOpen,
        setViewModalOpen,
    ] = useState(false);

    const [
        viewingMovement,
        setViewingMovement,
    ] = useState(null);

    // =====================================================
    // QUERY PARAMS
    // =====================================================

    const queryParams = useMemo(() => {
        const params = {
            page,
            limit,
        };

        if (productId.trim()) {
            params.productId =
                productId.trim();
        }

        if (warehouseId.trim()) {
            params.warehouseId =
                warehouseId.trim();
        }

        if (movementType !== "ALL") {
            params.movementType =
                movementType;
        }

        if (referenceType !== "ALL") {
            params.referenceType =
                referenceType;
        }

        return params;
    }, [
        page,
        limit,
        productId,
        warehouseId,
        movementType,
        referenceType,
    ]);

    // =====================================================
    // API
    // =====================================================

    const {
        data,
        isLoading,
        refetch,
    } = useStockMovements(
        queryParams,
    );

    const createMovement =
        useCreateStockMovement();

    const deleteMovement =
        useDeleteStockMovement();

    // =====================================================
    // DATA
    // =====================================================

    const movements =
        data?.data?.movements ||
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
        const total = Number(
            pagination?.total || 0,
        );

        const stockIn =
            movements.filter((movement) => {
                return (
                    movement.movementType?.endsWith(
                        "_IN",
                    ) ||
                    movement.movementType ===
                    "OPENING_STOCK" ||
                    movement.movementType ===
                    "PURCHASE" ||
                    movement.movementType ===
                    "SALES_RETURN"
                );
            }).length;

        const stockOut =
            movements.filter((movement) => {
                return (
                    movement.movementType?.endsWith(
                        "_OUT",
                    ) ||
                    movement.movementType ===
                    "SALE" ||
                    movement.movementType ===
                    "PURCHASE_RETURN"
                );
            }).length;

        return [
            {
                id: "total",
                title: "Total Movements",
                value: total,
                description:
                    "Stock movement records",
                icon: Boxes,
                iconClassName:
                    "bg-primary/10 text-primary",
            },

            {
                id: "in",
                title: "Stock In",
                value: stockIn,
                description:
                    "Inbound movements",
                icon: ArrowDownToLine,
                iconClassName:
                    "bg-green-500/10 text-green-600",
            },

            {
                id: "out",
                title: "Stock Out",
                value: stockOut,
                description:
                    "Outbound movements",
                icon: ArrowUpFromLine,
                iconClassName:
                    "bg-red-500/10 text-red-600",
            },

            {
                id: "activity",
                title: "Current Page",
                value: movements.length,
                description:
                    "Movements displayed",
                icon: Activity,
                iconClassName:
                    "bg-purple-500/10 text-purple-600",
            },
        ];
    }, [
        movements,
        pagination?.total,
    ]);

    // =====================================================
    // CREATE
    // =====================================================

    const handleAdd = () => {
        setModalOpen(true);
    };

    const handleSubmit = async (
        payload,
    ) => {
        try {
            await createMovement.mutateAsync(
                payload,
            );

            setModalOpen(false);

            await refetch();
        } catch (error) {
            console.error(
                "Failed to create stock movement:",
                error,
            );
        }
    };

    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (movement) => {
        setViewingMovement(movement);

        setViewModalOpen(true);
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (
        movement,
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this stock movement?",
            );

        if (!confirmed) return;

        try {
            await deleteMovement.mutateAsync(
                movement.id,
            );

            await refetch();
        } catch (error) {
            console.error(
                "Failed to delete stock movement:",
                error,
            );
        }
    };

    // =====================================================
    // CLEAR
    // =====================================================

    const handleClearFilters = () => {
        setProductId("");
        setWarehouseId("");
        setMovementType("ALL");
        setReferenceType("ALL");
        setPage(1);
    };

    const saving =
        createMovement.isPending;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Boxes}
                title="Stock Movements"
                description="Track all product stock movements and inventory changes"
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
                    label: "Add Movement",
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
                search={productId}
                onSearchChange={(value) => {
                    setProductId(value);
                    setPage(1);
                }}
                searchPlaceholder="Search by Product ID..."
                filters={[
                    {
                        name: "warehouse",
                        value: warehouseId,
                        onChange: (value) => {
                            setWarehouseId(value);
                            setPage(1);
                        },
                        placeholder: "Warehouse ID",
                        options: [],
                    },

                    {
                        name: "movementType",
                        value: movementType,
                        onChange: (value) => {
                            setMovementType(value);
                            setPage(1);
                        },
                        placeholder: "All Movements",
                        options: [
                            {
                                value: "ALL",
                                label: "All Movements",
                            },
                            ...MOVEMENT_TYPES,
                        ],
                    },

                    {
                        name: "referenceType",
                        value: referenceType,
                        onChange: (value) => {
                            setReferenceType(value);
                            setPage(1);
                        },
                        placeholder: "All References",
                        options: [
                            {
                                value: "ALL",
                                label: "All References",
                            },
                            ...REFERENCE_TYPES,
                        ],
                    },
                ]}
                onClear={
                    handleClearFilters
                }
            />

            {/* TABLE */}

            <StockMovementTable
                movements={movements}
                loading={isLoading}
                onView={handleView}
                onDelete={handleDelete}
                page={
                    Number(
                        pagination.page,
                    ) || page
                }
                totalPages={
                    Number(
                        pagination.totalPages,
                    ) || 1
                }
                total={
                    Number(
                        pagination.total,
                    ) || 0
                }
                limit={
                    Number(
                        pagination.limit,
                    ) || limit
                }
                onPageChange={setPage}
            />

            {/* CREATE MODAL */}

            <StockMovementModal
                open={modalOpen}
                onClose={() => {
                    if (saving) return;

                    setModalOpen(false);
                }}
                onSubmit={handleSubmit}
                loading={saving}
            />

            {/* VIEW MODAL */}

            <StockMovementViewModal
                open={viewModalOpen}
                movement={viewingMovement}
                onClose={() => {
                    setViewModalOpen(false);
                    setViewingMovement(null);
                }}
            />
        </div>
    );
}
>>>>>>> 8e1db6a2908d3179bced3d62c9ff7e07bced9985
