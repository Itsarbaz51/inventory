"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, ShieldCheck, UserRoundPlus } from "lucide-react";

import RoleModal from "@/components/models/RoleModal";
import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import RolesTable from "@/components/tables/RolesTable";
import roleService from "@/services/roleApi";
import useToast from "@/hooks/useToast";
import {
  usePermissions,
  useRolePermissions,
} from "@/hooks/permission/usePermission";
import PermissionModal from "@/components/models/PermissionModal";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [role, setRole] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, seteditingRole] = useState(null);

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);

  const [permissionRole, setPermissionRole] = useState(null);

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const toast = useToast();

  const { data: permissions, loading: permissionsLoading } = usePermissions();

  const {
    permissions: rolePermissions,
    loading: rolePermissionsLoading,
    saving: permissionSaving,
    updatePermissions,
  } = useRolePermissions(permissionRole?.id);

  // Fetch
  const fetchRoles = async () => {
    try {
      setLoading(true);

      const response = await roleService.getAll();

      setRoles(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch roles:", error);

      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!rolePermissions?.length) {
      setSelectedPermissions([]);
      return;
    }

    setSelectedPermissions(
      rolePermissions.map((permission) =>
        typeof permission === "string" ? permission : permission.id,
      ),
    );
  }, [rolePermissions]);

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter
  const filteredRoles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return roles.filter((role) => {
      const matchesSearch =
        !searchValue || role?.name?.toLowerCase().includes(searchValue);

      return matchesSearch;
    });
  }, [roles, search, status, role]);

  // Statistics
  const roleStats = useMemo(() => {
    const total = roles.length;
    const admins = roles.filter((role) => role?.role === "ADMIN").length;

    return {
      total,
      admins,
    };
  }, [roles]);

  // Stats Cards
  const stats = useMemo(
    () => [
      {
        id: "total",
        title: "Total roles",
        value: roleStats.total,
        description: "All registered roles",
        icon: UserRoundPlus,
        iconClassName: "bg-primary/10 text-primary",
      },

      {
        id: "admins",
        title: "Administrators",
        value: roleStats.admins,
        description: "Roles with admin access",
        icon: ShieldCheck,
        iconClassName: "bg-purple-500/10 text-purple-600",
      },
    ],
    [roleStats],
  );

  const handlePermissions = (role) => {
    setPermissionRole(role);
    setPermissionModalOpen(true);
  };

  // Add User
  const handleAdd = () => {
    seteditingRole(null);
    setModalOpen(true);
  };

  // Edit
  const handleEdit = (role) => {
    seteditingRole(role);
    setModalOpen(true);
  };

  // Delete
  const handleDelete = async (role) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${role?.name}?`,
    );

    if (!confirmed) return;

    try {
      await roleService.delete(role?.id);
      await fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  // Create / Update role
  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      if (editingRole) {
        const res = await roleService.update(editingRole.id, formData);
        toast.error(res.message, "Role success");
      } else {
        const res = await roleService.create(formData);
        toast.error(res.message, "Role success");
      }

      setModalOpen(false);
      seteditingRole(null);

      await fetchRoles();
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message, "Role failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    seteditingRole(null);
  };

  const handlePermissionSubmit = async (permissionIds) => {
    try {
      await updatePermissions(permissionIds);

      setPermissionModalOpen(false);
      setPermissionRole(null);
    } catch (error) {
      const message =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Failed to update permissions";

      toast.error(message, "Permission update failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserRoundPlus}
        title="Roles"
        description="Manage roles and their system access"
        secondaryAction={{
          label: "Refresh",
          icon: (
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          ),
          onClick: fetchRoles,
          disabled: loading,
        }}
        primaryAction={{
          label: "Add Role",
          icon: <Plus size={17} />,
          onClick: handleAdd,
        }}
      />

      <StatsCards stats={stats} columns={4} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search roles..."
        onClear={() => {
          setSearch("");
          setStatus("ALL");
          setRole("ALL");
        }}
      />

      <RolesTable
        roles={filteredRoles}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPermissions={handlePermissions}
      />

      <RoleModal
        open={modalOpen}
        onClose={handleCloseModal}
        role={editingRole}
        onSubmit={handleSubmit}
        loading={saving}
      />
      <PermissionModal
        open={permissionModalOpen}
        onClose={() => {
          if (permissionSaving) return;

          setPermissionModalOpen(false);
          setPermissionRole(null);
        }}
        role={permissionRole}
        permissions={permissions?.data || permissions || []}
        selectedPermissions={selectedPermissions}
        onChange={setSelectedPermissions}
        onSubmit={handlePermissionSubmit}
        loading={
          permissionsLoading || rolePermissionsLoading || permissionSaving
        }
      />
    </div>
  );
}
