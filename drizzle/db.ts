import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";

const { env } = getRequestContext();
export const D1 = env.DB;
export const db = drizzle(D1);
