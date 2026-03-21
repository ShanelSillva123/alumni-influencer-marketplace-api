import "dotenv/config";
import { defineConfig } from "prisma/config";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations"
    },
    datasource: {
        url: process.env.DATABASE_URL!
    }
});