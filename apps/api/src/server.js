import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import app from "./app.js";
import prisma from "./database/db.js";
import { envConfig } from "./config/index.js";

(async function main() {
  try {
    await prisma.$connect();

    console.log("✅ Database connected");

    const PORT = envConfig.PORT || 3000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup error:", error);

    process.exit(1);
  }
})();