"use client";

import React, { useMemo, useState } from "react";
import {
    Plus,
    RefreshCw,
    Building2,
    CheckCircle,
    XCircle,
    Ban,
} from "lucide-react";

import TenantsTable from "@/components/tables/TenantsTable";
import TenantModal from "@/components/models/TenantModel";
import TenantViewModal from "@/components/models/view/TenantViewModal";

import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";

import useTenants from "@/hooks/tenants/useTenants";

export default function TenantsPage() {
    // =====================================================
    // PAGINATION / FILTERS
    // =====================================================

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");

    // =====================================================
    // EDIT MODAL
    // =====================================================

    const [modalOpen, setModalOpen] =
        useState(false);

    const [editingTenant, setEditingTenant] =
        useState(null);

    // =====================================================
    // VIEW MODAL
    // =====================================================

    const [viewModalOpen, setViewModalOpen] =
        useState(false);

    const [viewTenant, setViewTenant] =
        useState(null);

    const [saving, setSaving] =
        useState(false);

    // =====================================================
    // QUERY
    // =====================================================

    const {
        data,
        error,
        isLoading,
        refetch,
    } = useTenants({
        page,
        limit,
        search: search.trim(),
        status:
            status === "ALL"
                ? undefined
                : status,
    });

    // =====================================================
    // DATA
    // =====================================================

    const tenants =
        data?.data?.tenants || [];

    const pagination =
        data?.data?.pagination || {
            page,
            limit,
            total: 0,
            totalPages: 1,
        };

    // =====================================================
    // STATISTICS
    // =====================================================

    const tenantStats = useMemo(() => {
        const total =
            Number(pagination?.total) || 0;

        const active = tenants.filter(
            (tenant) =>
                tenant?.status === "ACTIVE",
        ).length;

        const inactive = tenants.filter(
            (tenant) =>
                tenant?.status === "INACTIVE",
        ).length;

        const suspended = tenants.filter(
            (tenant) =>
                tenant?.status === "SUSPENDED",
        ).length;

        return {
            total,
            active,
            inactive,
            suspended,
        };
    }, [
        tenants,
        pagination?.total,
    ]);

    // =====================================================
    // STATS
    // =====================================================

    const stats = useMemo(
        () => [
            {
                id: "total",
                title: "Total Tenants",
                value: tenantStats.total,
                description:
                    "All registered tenants",
                icon: Building2,
                iconClassName:
                    "bg-primary/10 text-primary",
            },
            {
                id: "active",
                title: "Active Tenants",
                value: tenantStats.active,
                description: "Currently active",
                icon: CheckCircle,
                iconClassName:
                    "bg-green-500/10 text-green-600",
            },
            {
                id: "inactive",
                title: "Inactive Tenants",
                value: tenantStats.inactive,
                description:
                    "Currently inactive",
                icon: XCircle,
                iconClassName:
                    "bg-red-500/10 text-red-600",
            },
            {
                id: "suspended",
                title: "Suspended Tenants",
                value: tenantStats.suspended,
                description:
                    "Currently suspended",
                icon: Ban,
                iconClassName:
                    "bg-orange-500/10 text-orange-600",
            },
        ],
        [tenantStats],
    );

    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {
        setEditingTenant(null);
        setModalOpen(true);
    };

    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (tenant) => {
        setViewTenant(tenant);
        setViewModalOpen(true);
    };

    const handleCloseView = () => {
        setViewModalOpen(false);
        setViewTenant(null);
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (tenant) => {
        setEditingTenant(tenant);
        setModalOpen(true);
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (tenant) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${tenant?.name}?`,
            );

        if (!confirmed) return;

        try {
            // await deleteTenant(tenant.id);

            await refetch();
        } catch (error) {
            console.error(
                "Failed to delete tenant:",
                error,
            );
        }
    };

    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            if (editingTenant) {
                // await updateTenant(
                //   editingTenant.id,
                //   formData,
                // );

                console.log(
                    "Update tenant:",
                    editingTenant.id,
                    formData,
                );
            } else {
                // await createTenant(formData);

                console.log(
                    "Create tenant:",
                    formData,
                );
            }

            setModalOpen(false);
            setEditingTenant(null);

            await refetch();
        } catch (error) {
            console.error(
                "Failed to save tenant:",
                error,
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // CLOSE EDIT MODAL
    // =====================================================

    const handleCloseModal = () => {
        if (saving) return;

        setModalOpen(false);
        setEditingTenant(null);
    };

    // =====================================================
    // FILTERS
    // =====================================================

    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatus("ALL");
        setPage(1);
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Building2}
                title="Tenants"
                description="Manage tenants and their business settings"
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
                    label: "Add Tenant",
                    icon: <Plus size={17} />,
                    onClick: handleAdd,
                }}
            />

            <StatsCards
                stats={stats}
                columns={4}
            />

            <FilterBar
                search={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search tenants..."
                filters={[
                    {
                        name: "status",
                        value: status,
                        onChange: handleStatusChange,
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
                            {
                                value: "SUSPENDED",
                                label: "Suspended",
                            },
                        ],
                    },
                ]}
                onClear={handleClearFilters}
            />

            {error ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                    Failed to load tenants.
                </div>
            ) : (
                <TenantsTable
                    tenants={tenants}
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
                        Number(pagination.total) ||
                        0
                    }
                    limit={
                        Number(pagination.limit) ||
                        limit
                    }
                    onPageChange={setPage}
                />
            )}

            <div className="text-sm text-muted-foreground">
                Showing {tenants.length} tenants
                {pagination?.total != null
                    ? ` of ${pagination.total}`
                    : ""}
            </div>

            {/* Create / Edit */}
            <TenantModal
                open={modalOpen}
                onClose={handleCloseModal}
                tenant={editingTenant}
                onSubmit={handleSubmit}
                loading={saving}
            />

            {/* View */}
            <TenantViewModal
                open={viewModalOpen}
                onClose={handleCloseView}
                tenant={viewTenant}
            />
        </div>
    );
}
