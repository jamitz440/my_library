import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });
