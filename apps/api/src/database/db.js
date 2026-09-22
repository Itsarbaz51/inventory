import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";
import { envConfig } from "../config/index.js";

const adapter = new PrismaMariaDb({
    host: envConfig.DATABASE_HOST,
    user: envConfig.DATABASE_USER,
    password: envConfig.DATABASE_PASSWORD,
    database: envConfig.DATABASE_NAME,
    connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export default prisma;