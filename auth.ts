import { getRequestContext } from "@cloudflare/next-on-pages";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "./drizzle/db";
import { sessionTable, userTable } from "./drizzle/schema";

import type { Session, User } from "lucia";

export function initializeLucia() {
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
  return new Lucia(adapter, {
    sessionCookie: {
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        // attributes has the type of DatabaseUserAttributes
        username: attributes.username,
      };
    },
  });
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const { env } = getRequestContext();
    const sessionId =
      cookies().get(initializeLucia().sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await initializeLucia().validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = initializeLucia().createSessionCookie(
          result.session.id
        );
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = initializeLucia().createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
