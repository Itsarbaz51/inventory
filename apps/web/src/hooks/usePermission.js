"use client";

import { useCallback } from "react";

export default function usePermission(user) {
  const isSuperAdmin =
    user?.role === "SUPER_ADMIN" ||
    user?.role?.name === "SUPER_ADMIN";

  const hasPermission = useCallback(
    (permission) => {
      if (isSuperAdmin) {
        return true;
      }

      return (
        user?.permissions?.includes(permission) || false
      );
    },
    [user, isSuperAdmin],
  );

  const hasAnyPermission = useCallback(
    (permissions = []) => {
      if (isSuperAdmin) {
        return true;
      }

      return permissions.some((permission) =>
        user?.permissions?.includes(permission),
      );
    },
    [user, isSuperAdmin],
  );

  const hasAllPermissions = useCallback(
    (permissions = []) => {
      if (isSuperAdmin) {
        return true;
      }

      return permissions.every((permission) =>
        user?.permissions?.includes(permission),
      );
    },
    [user, isSuperAdmin],
  );

  return {
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}