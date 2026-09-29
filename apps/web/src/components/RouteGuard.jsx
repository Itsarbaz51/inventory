"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routePermissions } from "@/lib/routePermissions";
import usePermission from "@/hooks/usePermission";

export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isSuperAdmin, hasPermission } = usePermission();

  const [checking, setChecking] = useState(true);

  const route = useMemo(() => {
    if (!pathname) return null;

    return [...routePermissions]
      .sort((a, b) => b.pattern.length - a.pattern.length)
      .find(
        (item) =>
          pathname === item.pattern || pathname.startsWith(`${item.pattern}/`),
      );
  }, [pathname]);

  useEffect(() => {
    if (!pathname) return;

    // User data abhi load nahi hua
    if (!user) {
      return;
    }

    // Super admin → full access
    if (isSuperAdmin) {
      setChecking(false);
      return;
    }

    // Route permission defined nahi hai
    if (!route) {
      setChecking(false);
      return;
    }

    // Permission hai
    if (hasPermission(route.permission)) {
      setChecking(false);
      return;
    }

    // Permission nahi hai
    router.replace("/403");
  }, [pathname, user, route, isSuperAdmin, hasPermission, router]);

  // Permission check hone tak child page render mat karo
  if (checking) {
    return null;
  }

  return children;
}
