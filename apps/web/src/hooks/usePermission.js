"use client";

import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export default function usePermission() {
  const user = useSelector((state) => state.auth?.user);

  const isSuperAdmin = user?.role?.name?.toUpperCase() === "SUPER_ADMIN";

  const permissions = useMemo(() => {
    return (
      user?.role?.rolePermissions?.map(
        ({ permission }) => `${permission.module}.${permission.action}`,
      ) ?? []
    );
  }, [user]);

  const hasPermission = useCallback(
    (permission) => {
      if (isSuperAdmin) return true;

      return permissions.includes(permission);
    },
    [permissions, isSuperAdmin],
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions = []) => {
      if (isSuperAdmin) return true;

      return requiredPermissions.some((permission) =>
        permissions.includes(permission),
      );
    },
    [permissions, isSuperAdmin],
  );

  const hasAllPermissions = useCallback(
    (requiredPermissions = []) => {
      if (isSuperAdmin) return true;

      return requiredPermissions.every((permission) =>
        permissions.includes(permission),
      );
    },
    [permissions, isSuperAdmin],
  );

  return {
    user,
    permissions,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
