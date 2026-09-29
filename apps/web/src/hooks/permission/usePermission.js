"use client";

import { useCallback, useEffect, useState } from "react";
import permissionService from "@/services/permissionApi";
import useToast from "../useToast";

export const usePermissions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await permissionService.getAll();

      setData(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    data,
    loading,
    refetch: fetchPermissions,
  };
};

export const useRolePermissions = (roleId) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchRolePermissions = useCallback(async () => {
    if (!roleId) {
      setPermissions([]);
      return;
    }

    try {
      setLoading(true);

      const response = await permissionService.getRolePermissions(roleId);
      toast.success(response.message);
      setPermissions(response?.data?.permissions || []);
    } catch (error) {
      const response = error?.response?.data;

      toast.error(response.errors || response?.message, "Validation failed");
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    fetchRolePermissions();
  }, [fetchRolePermissions]);

  const updatePermissions = async (permissionIds) => {
    if (!roleId) {
      throw new Error("Role ID is required");
    }

    try {
      setSaving(true);

      const response = await permissionService.updateRolePermissions(
        roleId,
        permissionIds,
      );

      await fetchRolePermissions();

      return response;
    } finally {
      setSaving(false);
    }
  };

  return {
    permissions,
    loading,
    saving,
    updatePermissions,
    refetch: fetchRolePermissions,
  };
};
