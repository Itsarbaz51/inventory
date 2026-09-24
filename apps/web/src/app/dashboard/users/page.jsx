"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";

import UsersTable from "@/components/tables/UsersTable";
import UserModal from "@/components/models/UserModal";
import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [role, setRole] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      // TODO: Replace with API
      // const response = await getUsers();

      const response = {
        data: [],
      };

      setUsers(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Users
  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user?.name?.toLowerCase().includes(searchValue) ||
        user?.email?.toLowerCase().includes(searchValue) ||
        user?.phone?.toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && user?.isActive) ||
        (status === "INACTIVE" && !user?.isActive);

      const matchesRole = role === "ALL" || user?.role === role;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, status, role]);

  // Statistics
  const userStats = useMemo(() => {
    const total = users.length;

    const active = users.filter((user) => user?.isActive).length;

    const inactive = total - active;

    const admins = users.filter((user) => user?.role === "ADMIN").length;

    return {
      total,
      active,
      inactive,
      admins,
    };
  }, [users]);

  // Stats Cards
  const stats = useMemo(
    () => [
      {
        id: "total",
        title: "Total Users",
        value: userStats.total,
        description: "All registered users",
        icon: Users,
        iconClassName: "bg-primary/10 text-primary",
      },

      {
        id: "active",
        title: "Active Users",
        value: userStats.active,
        description: "Currently active",
        icon: UserCheck,
        iconClassName: "bg-green-500/10 text-green-600",
      },

      {
        id: "inactive",
        title: "Inactive Users",
        value: userStats.inactive,
        description: "Currently inactive",
        icon: UserX,
        iconClassName: "bg-red-500/10 text-red-600",
      },

      {
        id: "admins",
        title: "Administrators",
        value: userStats.admins,
        description: "Users with admin access",
        icon: ShieldCheck,
        iconClassName: "bg-purple-500/10 text-purple-600",
      },
    ],
    [userStats],
  );

  // Add User
  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  // Edit User
  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  // Delete User
  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user?.name}?`,
    );

    if (!confirmed) return;

    try {
      // TODO:
      // await deleteUser(user.id);

      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // Create / Update User
  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      if (editingUser) {
        // TODO:
        // await updateUser(editingUser.id, formData);

        console.log("Update user:", editingUser.id, formData);
      } else {
        // TODO:
        // await createUser(formData);

        console.log("Create user:", formData);
      }

      setModalOpen(false);
      setEditingUser(null);

      await fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Users"
        description="Manage users and their system access"
        secondaryAction={{
          label: "Refresh",
          icon: (
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          ),
          onClick: fetchUsers,
          disabled: loading,
        }}
        primaryAction={{
          label: "Add User",
          icon: <Plus size={17} />,
          onClick: handleAdd,
        }}
      />

      <StatsCards stats={stats} columns={4} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        filters={[
          {
            name: "status",
            value: status,
            onChange: setStatus,
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
          {
            name: "role",
            value: role,
            onChange: setRole,
            placeholder: "All Roles",
            options: [
              {
                value: "ALL",
                label: "All Roles",
              },
              {
                value: "ADMIN",
                label: "Admin",
              },
              {
                value: "MANAGER",
                label: "Manager",
              },
              {
                value: "STAFF",
                label: "Staff",
              },
            ],
          },
        ]}
        onClear={() => {
          setSearch("");
          setStatus("ALL");
          setRole("ALL");
        }}
      />

      <UsersTable
        users={filteredUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserModal
        open={modalOpen}
        onClose={handleCloseModal}
        user={editingUser}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
