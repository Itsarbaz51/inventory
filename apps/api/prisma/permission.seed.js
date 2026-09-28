import Prisma from "../src/database/db.js";

const permissions = [
    ["DASHBOARD", "VIEW"],

    // ["USERS", "VIEW"],
    // ["USERS", "CREATE"],
    // ["USERS", "UPDATE"],
    // ["USERS", "DELETE"],

    // ["ROLES", "VIEW"],
    // ["ROLES", "CREATE"],
    // ["ROLES", "UPDATE"],
    // ["ROLES", "DELETE"],

    ["PRODUCTS", "VIEW"],
    ["PRODUCTS", "CREATE"],
    ["PRODUCTS", "UPDATE"],
    ["PRODUCTS", "DELETE"],
    ["PRODUCTS", "IMPORT"],
    ["PRODUCTS", "EXPORT"],

    ["CATEGORIES", "VIEW"],
    ["CATEGORIES", "CREATE"],
    ["CATEGORIES", "UPDATE"],
    ["CATEGORIES", "DELETE"],

    ["BRANDS", "VIEW"],
    ["BRANDS", "CREATE"],
    ["BRANDS", "UPDATE"],
    ["BRANDS", "DELETE"],

    ["UNITS", "VIEW"],
    ["UNITS", "CREATE"],
    ["UNITS", "UPDATE"],
    ["UNITS", "DELETE"],

    ["WAREHOUSES", "VIEW"],
    ["WAREHOUSES", "CREATE"],
    ["WAREHOUSES", "UPDATE"],
    ["WAREHOUSES", "DELETE"],

    ["SUPPLIERS", "VIEW"],
    ["SUPPLIERS", "CREATE"],
    ["SUPPLIERS", "UPDATE"],
    ["SUPPLIERS", "DELETE"],

    ["CUSTOMERS", "VIEW"],
    ["CUSTOMERS", "CREATE"],
    ["CUSTOMERS", "UPDATE"],
    ["CUSTOMERS", "DELETE"],

    ["PURCHASES", "VIEW"],
    ["PURCHASES", "CREATE"],
    ["PURCHASES", "UPDATE"],
    ["PURCHASES", "DELETE"],
    ["PURCHASES", "APPROVE"],
    ["PURCHASES", "EXPORT"],

    ["SALES", "VIEW"],
    ["SALES", "CREATE"],
    ["SALES", "UPDATE"],
    ["SALES", "DELETE"],
    ["SALES", "APPROVE"],
    ["SALES", "EXPORT"],

    ["PURCHASE_RETURNS", "VIEW"],
    ["PURCHASE_RETURNS", "CREATE"],
    ["PURCHASE_RETURNS", "UPDATE"],
    ["PURCHASE_RETURNS", "DELETE"],
    ["PURCHASE_RETURNS", "APPROVE"],

    ["SALES_RETURNS", "VIEW"],
    ["SALES_RETURNS", "CREATE"],
    ["SALES_RETURNS", "UPDATE"],
    ["SALES_RETURNS", "DELETE"],
    ["SALES_RETURNS", "APPROVE"],

    ["PAYMENTS", "VIEW"],
    ["PAYMENTS", "CREATE"],
    ["PAYMENTS", "UPDATE"],
    ["PAYMENTS", "DELETE"],

    ["STOCK", "VIEW"],
    ["STOCK", "IMPORT"],
    ["STOCK", "EXPORT"],
    ["STOCK", "UPDATE"],

    ["REPORTS", "VIEW"],
    ["REPORTS", "EXPORT"],

    ["NOTIFICATIONS", "VIEW"],

    ["AUDIT_LOGS", "VIEW"],
    ["AUDIT_LOGS", "EXPORT"],
];

async function main() {
    for (const [module, action] of permissions) {
        await Prisma.permission.upsert({
            where: {
                unique_permission: {
                    module,
                    action,
                },
            },
            update: {},
            create: {
                module,
                action,
                description: `${action} permission for ${module}`,
            },
        });
    }

    console.log("Default permissions seeded successfully");
}

main()
    .catch(console.error)
    .finally(async () => {
        await Prisma.$disconnect();
    });