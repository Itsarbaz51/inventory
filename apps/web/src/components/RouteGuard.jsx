"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routePermissions } from "@/lib/routePermissions";
import usePermission from "@/hooks/usePermission";

export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isSuperAdmin, hasPermission } = usePermission();

  useEffect(() => {
    if (!pathname || !user) return;

    // SUPER ADMIN = full access
    if (isSuperAdmin) {
      return;
    }

    const route = routePermissions.find(
      (item) =>
        pathname === item.pattern || pathname.startsWith(`${item.pattern}/`),
    );

    // Route mapping nahi hai
    if (!route) {
      return;
    }

    // Permission check
    const allowed = hasPermission(route.permission);

    if (!allowed) {
      router.replace("/403");
    }
  }, [pathname, user, isSuperAdmin, hasPermission, router]);

  return children;
}
