"use client";

import React, { useMemo, useState } from "react";

import { Plus, RefreshCw, Users, UserCheck, UserX, Wallet } from "lucide-react";

import CustomersCards from "@/components/cards/CustomersCards";
import CustomerModal from "@/components/models/CustomerModal";
import CustomerViewModal from "@/components/models/view/CustomerViewModal";

import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";

import useCustomers from "@/hooks/customers/useCustomers";
import useCreateCustomer from "@/hooks/customers/useCreateCustomer";
import useUpdateCustomer from "@/hooks/customers/useUpdateCustomer";
import useDeleteCustomer from "@/hooks/customers/useDeleteCustomer";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("ALL");

  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [viewingCustomer, setViewingCustomer] = useState(null);

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

  const { data, isLoading, refetch } = useCustomers(queryParams);

  const createCustomer = useCreateCustomer();

  const updateCustomer = useUpdateCustomer();

  const deleteCustomer = useDeleteCustomer();

  const customers = data?.data?.customers || data?.data || [];

  const pagination = data?.data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 1,
  };

  const stats = useMemo(() => {
    const total = Number(pagination?.total || 0);

    const active = customers.filter((customer) => customer.isActive).length;

    const inactive = customers.filter((customer) => !customer.isActive).length;

    const walkIn = customers.filter((customer) => customer.isWalkIn).length;

    return [
      {
        id: "total",
        title: "Total Customers",
        value: total,
        description: "Registered customers",
        icon: Users,
        iconClassName: "bg-primary/10 text-primary",
      },
      {
        id: "active",
        title: "Active",
        value: active,
        description: "Active customers",
        icon: UserCheck,
        iconClassName: "bg-green-500/10 text-green-600",
      },
      {
        id: "inactive",
        title: "Inactive",
        value: inactive,
        description: "Inactive customers",
        icon: UserX,
        iconClassName: "bg-red-500/10 text-red-600",
      },
      {
        id: "walkIn",
        title: "Walk-in",
        value: walkIn,
        description: "Walk-in customers",
        icon: Wallet,
        iconClassName: "bg-purple-500/10 text-purple-600",
      },
    ];
  }, [customers, pagination?.total]);

  const handleAdd = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleView = (customer) => {
    setViewingCustomer(customer);
    setViewModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingCustomer) {
        await updateCustomer.mutateAsync({
          id: editingCustomer.id,
          payload,
        });
      } else {
        await createCustomer.mutateAsync(payload);
      }

      setModalOpen(false);
      setEditingCustomer(null);

      await refetch();
    } catch (error) {
      console.error("Failed to save customer:", error);
    }
  };

  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer?.name}?`,
    );

    if (!confirmed) return;

    try {
      await deleteCustomer.mutateAsync(customer.id);

      await refetch();
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setIsActive("ALL");
    setPage(1);
  };

  const saving = createCustomer.isPending || updateCustomer.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Customers"
        description="Manage your customers and customer accounts"
        secondaryAction={{
          label: "Refresh",
          icon: (
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          ),
          onClick: refetch,
          disabled: isLoading,
        }}
        primaryAction={{
          label: "Add Customer",
          icon: <Plus size={17} />,
          onClick: handleAdd,
        }}
      />

      <StatsCards stats={stats} columns={4} />

      <FilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search customers..."
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

      <CustomersCards
        customers={customers}
        loading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={Number(pagination.page) || page}
        totalPages={Number(pagination.totalPages) || 1}
        total={Number(pagination.total) || 0}
        limit={Number(pagination.limit) || limit}
        onPageChange={setPage}
      />

      <CustomerModal
        open={modalOpen}
        onClose={() => {
          if (saving) return;

          setModalOpen(false);
          setEditingCustomer(null);
        }}
        customer={editingCustomer}
        onSubmit={handleSubmit}
        loading={saving}
      />

      <CustomerViewModal
        open={viewModalOpen}
        customer={viewingCustomer}
        onClose={() => {
          setViewModalOpen(false);
          setViewingCustomer(null);
        }}
      />
    </div>
  );
}
