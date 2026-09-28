"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";

import UsersTable from "@/components/tables/UsersTable";
import UserModal from "@/components/models/UserModal";
import UserViewModal from "@/components/models/view/UserViewModal";

import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";

import useUsers from "@/hooks/users/useUsers";
import useRoles from "@/hooks/roles/useRoles";
import useCreateUser from "@/hooks/users/useCreateUser";
import useUpdateUser from "@/hooks/users/useUpdateUser";
import useTenants from "@/hooks/tenants/useTenants";

export default function UsersPage() {
  // =====================================================
  // FILTERS / PAGINATION
  // =====================================================

  const [status, setStatus] = useState("ALL");
  const [roleId, setRoleId] = useState("ALL");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // =====================================================
  // USER MODAL
  // =====================================================

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // =====================================================
  // VIEW MODAL
  // =====================================================

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

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

    if (status !== "ALL") {
      params.status = status;
    }

    if (roleId !== "ALL") {
      params.roleId = roleId;
    }

    return params;
  }, [page, limit, search, status, roleId]);

  // =====================================================
  // USERS
  // =====================================================

  const {
    data,
    errors,
    isLoading,
    refetch,
  } = useUsers(queryParams);

  // =====================================================
  // MUTATIONS
  // =====================================================

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const saving =
    createUser.isPending ||
    updateUser.isPending;

  // =====================================================
  // TENANTS
  // =====================================================

  const {
    data: tenantsResponse,
  } = useTenants({
    page: 1,
    limit: 100,
  });

  const tenants =
    tenantsResponse?.data?.tenants || [];

  // =====================================================
  // ROLES
  // =====================================================

  const {
    data: rolesResponse,
  } = useRoles();

  const roles = rolesResponse?.data || [];

  const roleOptions = useMemo(() => {
    return roles.map((role) => ({
      value: role.id,
      label: role.name,
    }));
  }, [roles]);

  // =====================================================
  // USERS DATA
  // =====================================================

  const users =
    data?.data?.users || [];

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

  const userStats = useMemo(() => {
    const total =
      Number(pagination?.total) || 0;

    const active = users.filter(
      (user) => user?.status === "ACTIVE",
    ).length;

    const inactive = users.filter(
      (user) => user?.status === "INACTIVE",
    ).length;

    const admins = users.filter(
      (user) =>
        user?.role?.name === "SUPER_ADMIN",
    ).length;

    return {
      total,
      active,
      inactive,
      admins,
    };
  }, [users, pagination?.total]);

  // =====================================================
  // STATS CARDS
  // =====================================================

  const stats = useMemo(
    () => [
      {
        id: "total",
        title: "Total Users",
        value: userStats.total,
        description: "Total registered users",
        icon: Users,
        iconClassName:
          "bg-primary/10 text-primary",
      },
      {
        id: "active",
        title: "Active Users",
        value: userStats.active,
        description: "Currently active",
        icon: UserCheck,
        iconClassName:
          "bg-green-500/10 text-green-600",
      },
      {
        id: "inactive",
        title: "Inactive Users",
        value: userStats.inactive,
        description: "Currently inactive",
        icon: UserX,
        iconClassName:
          "bg-red-500/10 text-red-600",
      },
      {
        id: "admins",
        title: "Super Admins",
        value: userStats.admins,
        description: "Users with full access",
        icon: ShieldCheck,
        iconClassName:
          "bg-purple-500/10 text-purple-600",
      },
    ],
    [userStats],
  );

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = (user) => {
    setViewingUser(user);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    if (saving) return;

    setViewModalOpen(false);
    setViewingUser(null);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user?.name}?`,
    );

    if (!confirmed) return;

    try {
      // await deleteUser(user.id);

      await refetch();
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error,
      );
    }
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (formData) => {
    try {
      if (editingUser) {
        await updateUser.mutateAsync({
          id: editingUser.id,
          payload: formData,
        });
      } else {
        await createUser.mutateAsync(
          formData,
        );
      }

      setModalOpen(false);
      setEditingUser(null);

      await refetch();
    } catch (error) {
      console.error(
        "Failed to save user:",
        error,
      );
    }
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingUser(null);
  };

  // =====================================================
  // FILTER HANDLERS
  // =====================================================

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleRoleChange = (value) => {
    setRoleId(value);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setRoleId("ALL");
    setPage(1);
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Users"
        description="Manage users and their system access"
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
          label: "Add User",
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
        searchPlaceholder="Search users..."
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
                value: "BLOCKED",
                label: "Blocked",
              },
            ],
          },
          {
            name: "roleId",
            value: roleId,
            onChange: handleRoleChange,
            placeholder: "All Roles",
            options: [
              {
                value: "ALL",
                label: "All Roles",
              },
              ...roleOptions,
            ],
          },
        ]}
        onClear={handleClearFilters}
      />

      <UsersTable
        users={users}
        loading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={Number(pagination.page) || page}
        totalPages={
          Number(pagination.totalPages) || 1
        }
        total={
          Number(pagination.total) || 0
        }
        limit={
          Number(pagination.limit) || limit
        }
        onPageChange={setPage}
      />

      <div className="text-sm text-muted-foreground">
        Showing {users.length} users
        {pagination?.total != null
          ? ` of ${pagination.total}`
          : ""}
      </div>

      {/* Create / Edit */}
      <UserModal
        open={modalOpen}
        onClose={handleCloseModal}
        user={editingUser}
        onSubmit={handleSubmit}
        loading={saving}
        roleOptions={roleOptions}
        tenants={tenants}
      />

      {/* View */}
      <UserViewModal
        open={viewModalOpen}
        user={viewingUser}
        onClose={handleCloseViewModal}
      />
    </div>
  );
}
