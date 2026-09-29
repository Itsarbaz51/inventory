import { PermissionsRegistry } from "./PermissionsRegistry";

export const routePermissions = [
  {
    pattern: "/dashboard",
    permission: PermissionsRegistry.DASHBOARD.VIEW,
  },
  {
    pattern: "/products",
    permission: PermissionsRegistry.PRODUCT.VIEW,
  },
  {
    pattern: "/categories",
    permission: PermissionsRegistry.CATEGORY.VIEW,
  },
  {
    pattern: "/brands",
    permission: PermissionsRegistry.BRAND.VIEW,
  },
  {
    pattern: "/units",
    permission: PermissionsRegistry.UNIT.VIEW,
  },
  {
    pattern: "/warehouses",
    permission: PermissionsRegistry.WAREHOUSE.VIEW,
  },
  {
    pattern: "/stock",
    permission: PermissionsRegistry.STOCK.VIEW,
  },
  {
    pattern: "/stock-movements",
    permission: PermissionsRegistry.STOCK.VIEW,
  },
  {
    pattern: "/suppliers",
    permission: PermissionsRegistry.SUPPLIER.VIEW,
  },
  {
    pattern: "/purchases",
    permission: PermissionsRegistry.PURCHASE.VIEW,
  },
  {
    pattern: "/purchase-returns",
    permission: PermissionsRegistry.PURCHASE_RETURN.VIEW,
  },
  {
    pattern: "/customers",
    permission: PermissionsRegistry.CUSTOMER.VIEW,
  },
  {
    pattern: "/sales",
    permission: PermissionsRegistry.SALE.VIEW,
  },
  {
    pattern: "/sales-returns",
    permission: PermissionsRegistry.SALES_RETURN.VIEW,
  },
  {
    pattern: "/payments",
    permission: PermissionsRegistry.PAYMENT.VIEW,
  },
  {
    pattern: "/reports",
    permission: PermissionsRegistry.REPORT.VIEW,
  },
  {
    pattern: "/dashboard/tenants",
    permission: PermissionsRegistry.TENANT.VIEW,
  },
  {
    pattern: "/dashboard/roles",
    permission: PermissionsRegistry.ROLE.VIEW,
  },
  {
    pattern: "/dashboard/users",
    permission: PermissionsRegistry.USER.VIEW,
  },
];
